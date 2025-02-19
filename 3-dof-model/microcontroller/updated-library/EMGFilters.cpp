/*
 * EMGFilters.cpp
 */

#include "EMGFilters.h"
#include <stdlib.h> // For NULL

// Coefficients of transfer function of LPF
// coef[sampleFreqInd][order]
static float lpf_numerator_coef[2][3] = {
    {0.3913f, 0.7827f, 0.3913f},
    {0.1311f, 0.2622f, 0.1311f}
};

static float lpf_denominator_coef[2][3] = {
    {1.0000f, 0.3695f, 0.1958f},
    {1.0000f, -0.7478f, 0.2722f}
};

// Coefficients of transfer function of HPF
static float hpf_numerator_coef[2][3] = {
    {0.8371f, -1.6742f, 0.8371f},
    {0.9150f, -1.8299f, 0.9150f}
};

static float hpf_denominator_coef[2][3] = {
    {1.0000f, -1.6475f, 0.7009f},
    {1.0000f, -1.8227f, 0.8372f}
};

// Coefficients of transfer function of anti-hum filter
// coef[sampleFreqInd][order] for 50Hz
static float ahf_numerator_coef_50Hz[2][6] = {
    {0.9522f, -1.5407f, 0.9522f, 0.8158f, -0.8045f, 0.0855f},
    {0.5869f, -1.1146f, 0.5869f, 1.0499f, -2.0000f, 1.0499f}
};
static float ahf_denominator_coef_50Hz[2][6] = {
    {1.0000f, -1.5395f, 0.9056f, 1.0000f, -1.1187f, 0.3129f},
    {1.0000f, -1.8844f, 0.9893f, 1.0000f, -1.8991f, 0.9892f}
};
static float ahf_output_gain_coef_50Hz[2] = {1.3422f, 1.4399f};

// Coef[sampleFreqInd][order] for 60Hz
static float ahf_numerator_coef_60Hz[2][6] = {
    {0.9528f, -1.3891f, 0.9528f, 0.8272f, -0.7225f, 0.0264f},
    {0.5824f, -1.0810f, 0.5824f, 1.0736f, -2.0000f, 1.0736f}
};
static float ahf_denominator_coef_60Hz[2][6] = {
    {1.0000f, -1.3880f, 0.9066f, 1.0000f, -0.9739f, 0.2371f},
    {1.0000f, -1.8407f, 0.9894f, 1.0000f, -1.8584f, 0.9891f}
};
static float ahf_output_gain_coef_60Hz[2] = {1.3430f, 1.4206f};

// Definitions for filter types are already in the header - no need to redeclare here

// Implementing FILTER_2nd class
class FILTER_2nd {
  private:
    // Second-order filter coefficients
    float states[2];
    float num[3];
    float den[3];

  public:
    void init(FILTER_TYPE ftype, int sampleFreq);
    float update(float input);
};

void FILTER_2nd::init(FILTER_TYPE ftype, int sampleFreq) {
    states[0] = 0;
    states[1] = 0;
    int sampleFreqInd = (sampleFreq == SAMPLE_FREQ_500HZ) ? 0 : 1;
    if (ftype == FILTER_TYPE_LOWPASS) {
        for (int i = 0; i < 3; i++) {
            num[i] = lpf_numerator_coef[sampleFreqInd][i];
            den[i] = lpf_denominator_coef[sampleFreqInd][i];
        }
    } else if (ftype == FILTER_TYPE_HIGHPASS) {
        for (int i = 0; i < 3; i++) {
            num[i] = hpf_numerator_coef[sampleFreqInd][i];
            den[i] = hpf_denominator_coef[sampleFreqInd][i];
        }
    }
}

float FILTER_2nd::update(float input) {
    float tmp = (input - den[1] * states[0] - den[2] * states[1]) / den[0];
    float output = num[0] * tmp + num[1] * states[0] + num[2] * states[1];
    // Update states
    states[1] = states[0];
    states[0] = tmp;
    return output;
}

// Implementing FILTER_4th class
class FILTER_4th {
  private:
    // Fourth-order filter coefficients
    float states[4];
    float num[6];
    float den[6];
    float gain;

  public:
    void init(int sampleFreq, int humFreq);
    float update(float input);
};

void FILTER_4th::init(int sampleFreq, int humFreq) {
    gain = 0;
    for (int i = 0; i < 4; i++) {
        states[i] = 0;
    }
    int sampleFreqInd = (sampleFreq == SAMPLE_FREQ_500HZ) ? 0 : 1;
    if (humFreq == NOTCH_FREQ_50HZ) {
        for (int i = 0; i < 6; i++) {
            num[i] = ahf_numerator_coef_50Hz[sampleFreqInd][i];
            den[i] = ahf_denominator_coef_50Hz[sampleFreqInd][i];
        }
        gain = ahf_output_gain_coef_50Hz[sampleFreqInd];
    } else if (humFreq == NOTCH_FREQ_60HZ) {
        for (int i = 0; i < 6; i++) {
            num[i] = ahf_numerator_coef_60Hz[sampleFreqInd][i];
            den[i] = ahf_denominator_coef_60Hz[sampleFreqInd][i];
        }
        gain = ahf_output_gain_coef_60Hz[sampleFreqInd];
    }
}

float FILTER_4th::update(float input) {
    float output;
    float stageIn;
    float stageOut;

    // First stage
    stageOut = num[0] * input + states[0];
    states[0] = num[1] * input + states[1] - den[1] * stageOut;
    states[1] = num[2] * input - den[2] * stageOut;

    // Second stage
    stageIn = stageOut;
    stageOut = num[3] * stageOut + states[2];
    states[2] = num[4] * stageIn + states[3] - den[4] * stageOut;
    states[3] = num[5] * stageIn - den[5] * stageOut;

    output = gain * stageOut;

    return output;
}

// Implementation of EMGFilters class

EMGFilters::EMGFilters() {
    LPF = new FILTER_2nd();
    HPF = new FILTER_2nd();
    AHF = new FILTER_4th();
}

EMGFilters::~EMGFilters() {
    delete LPF;
    delete HPF;
    delete AHF;
}

void EMGFilters::init(SAMPLE_FREQUENCY sampleFreq,
                      NOTCH_FREQUENCY  notchFreq,
                      bool             enableNotchFilter,
                      bool             enableLowpassFilter,
                      bool             enableHighpassFilter) {
    m_sampleFreq   = sampleFreq;
    m_notchFreq    = notchFreq;
    m_bypassEnabled = !(((sampleFreq == SAMPLE_FREQ_500HZ) ||
                         (sampleFreq == SAMPLE_FREQ_1000HZ)) &&
                        ((notchFreq == NOTCH_FREQ_50HZ) || (notchFreq == NOTCH_FREQ_60HZ)));

    LPF->init(FILTER_TYPE_LOWPASS, m_sampleFreq);
    HPF->init(FILTER_TYPE_HIGHPASS, m_sampleFreq);
    AHF->init(m_sampleFreq, m_notchFreq);

    m_notchFilterEnabled    = enableNotchFilter;
    m_lowpassFilterEnabled  = enableLowpassFilter;
    m_highpassFilterEnabled = enableHighpassFilter;
}

int EMGFilters::update(int inputValue) {
    float output = 0;
    if (m_bypassEnabled) {
        return inputValue;
    }

    // Notch filter
    if (m_notchFilterEnabled) {
        output = AHF->update((float)inputValue);
    } else {
        output = (float)inputValue;
    }

    // Low-pass filter
    if (m_lowpassFilterEnabled) {
        output = LPF->update(output);
    }

    // High-pass filter
    if (m_highpassFilterEnabled) {
        output = HPF->update(output);
    }

    return (int)output;
}
