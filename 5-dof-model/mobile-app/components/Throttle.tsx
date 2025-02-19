import { View } from '@/components/Themed';
import { StyleSheet, Text } from 'react-native';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@/components/ui/slider';
import { Image } from 'react-native';

interface ThrottleProps {
    value: number;
    setValue: (value: number) => void;
    label: string;
    disabled?: boolean;
}

export default function Throttle({ value, setValue, disabled = false, label }: ThrottleProps) {
    const handleChange = (value: number) => {
        setValue(value);
    };

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
            </View>
            <Slider
                value={value}
                size="sm"
                orientation="vertical"
                isDisabled={disabled}
                isReversed={false}
                style={styles.slider}
                onChange={handleChange}
                defaultValue={0}
                minValue={0}
                maxValue={100}
            >
                <SliderTrack style={styles.sliderTrack}>
                    <SliderFilledTrack style={{
                        backgroundColor: '#0f0',
                    }} />
                </SliderTrack>
                {!disabled && (
                    <SliderThumb style={styles.thumb}>
                        <Image
                            source={require('@/assets/images/slider.png')}
                            style={styles.sliderThumbImage}
                        />
                    </SliderThumb>
                )}
            </Slider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 280,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    labelContainer: {
        marginBottom: 10,
    },
    label: {
        color: '#0f0',
        fontSize: 16,
    },
    slider: {
        height: 240,
        borderRadius: 10,
    },
    sliderTrack: {
        backgroundColor: '#1c1c1c',
        borderColor: '#0f0',
        borderWidth: 1,
        borderRadius: 10,
        width: 40,
    },
    thumb: {
        backgroundColor: 'transparent',
    },
    sliderThumbImage: {
        width: 60,
        height: 60,
        position: 'absolute',
        left: -23,
        top: -30,
        resizeMode: 'contain',
    },
});