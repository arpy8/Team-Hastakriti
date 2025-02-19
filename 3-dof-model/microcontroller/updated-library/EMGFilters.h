/*
 * EMGFilters.h
 */

#ifndef _EMGFILTERS_H
#define _EMGFILTERS_H

enum NOTCH_FREQUENCY { NOTCH_FREQ_50HZ = 50, NOTCH_FREQ_60HZ = 60 };
enum SAMPLE_FREQUENCY { SAMPLE_FREQ_500HZ = 500, SAMPLE_FREQ_1000HZ = 1000 };

// Definitions for filter types
enum FILTER_TYPE {
    FILTER_TYPE_LOWPASS = 0,
    FILTER_TYPE_HIGHPASS,
};

// Forward declarations of filter classes
class FILTER_2nd;
class FILTER_4th;

class EMGFilters {
  public:
    EMGFilters();                  // Constructor
    ~EMGFilters();                 // Destructor

    void init(SAMPLE_FREQUENCY sampleFreq,
              NOTCH_FREQUENCY  notchFreq,
              bool             enableNotchFilter    = true,
              bool             enableLowpassFilter  = true,
              bool             enableHighpassFilter = true);

    int update(int inputValue);

  private:
    SAMPLE_FREQUENCY m_sampleFreq;
    NOTCH_FREQUENCY  m_notchFreq;
    bool             m_bypassEnabled;
    bool             m_notchFilterEnabled;
    bool             m_lowpassFilterEnabled;
    bool             m_highpassFilterEnabled;

    // Member variables for filters
    FILTER_2nd* LPF;
    FILTER_2nd* HPF;
    FILTER_4th* AHF;
};

#endif
