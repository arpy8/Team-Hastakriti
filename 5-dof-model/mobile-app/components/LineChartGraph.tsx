import { Text, View } from '@/components/Themed';
import { Dimensions } from 'react-native';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";



const screenWidth = Dimensions.get("window").width;

interface GraphComponentProps {
    title: string;
    data: any;
    chartConfig: any;
}

export function LineChartGraph({ title, data, chartConfig }: GraphComponentProps) {
    return (

        <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</Text>
            <LineChart
                data={data}
                withOuterLines={true}
                transparent={true}
                width={Dimensions.get("window").width - 45}
                height={200}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}

export function BarChartGraph({ title, data, chartConfig }: GraphComponentProps) {
    return (
        <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</Text>
            <BarChart
                data={data}
                withOuterLines={true}
                transparent={true}
                width={Dimensions.get("window").width - 45}
                height={200}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}

export function ProgressChartGraph({ title, data, chartConfig }: GraphComponentProps) {
    return (
        <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</Text>
            <ProgressChart
                data={data}
                width={screenWidth}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={chartConfig}
                hideLegend={false}
            />
        </View>
    );
}

export function PieChartGraph({ title, data, chartConfig }: GraphComponentProps) {
    return (
        <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</Text>
            <PieChart
                data={data}
                withOuterLines={true}
                transparent={true}
                width={Dimensions.get("window").width - 45}
                height={200}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}

export function ContributionChartGraph({ title, data, chartConfig }: GraphComponentProps) {
    return (
        <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</Text>
            <ContributionGraph
                data={data}
                withOuterLines={true}
                transparent={true}
                width={Dimensions.get("window").width - 45}
                height={200}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}

export function StackedBarChartGraph({ title, data, chartConfig }: GraphComponentProps) {
    return (
        <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</Text>
            <StackedBarChart
                data={data}
                withOuterLines={true}
                transparent={true}
                width={Dimensions.get("window").width - 45}
                height={200}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}