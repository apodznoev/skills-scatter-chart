import React, {Component} from 'react';
import {CartesianGrid, LabelList, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from "recharts";
import skillsData from '../data.json';

const renderCustomizedLabel = (props) => {
    const {
        x, y, width, height, value, position, index, offset
    } = props;

    const markerHeight = height;

    const currentData = skillsData[index];

    var samePositionCount = 0;
    skillsData.forEach(function (element, i) {
        if (i < index && element.can === currentData.can && element.want === currentData.want) {
            samePositionCount = samePositionCount + 1;
        }
    });

    var samePosition = samePositionCount !== 0;

    if (samePosition) {
        console.log(value + ", x=" + x + ", y=" + y, ", width=" + width, ", height=" + markerHeight, props);
        console.log("has same position as previous element", samePositionCount);
    }

    var yPosition = y - markerHeight;
    var xPosition = x + width / 2;
    var anchor = "middle";
    var baseline = "middle";
    var dx = 0;
    var dy = 0;

    if (samePositionCount === 1) {
        yPosition = y + 2 * markerHeight + offset;
    }

    if (samePositionCount === 2) {
        dx = value.length / 2;
        dy = 1;
    }

    if (samePositionCount === 3) {
        dx = -value.length / 2;
        dy = 1;
    }


    const formatMultiline = (text) => {
        var words = text.split(' ');

        var opts = {
            x: x,
            dx: dx + "ex",
            dy: dy + "em"
        };

        if (words.length > 2) {
            return words.map((word, index) => {
                const offset = index === 0 ? (dy !== 0 ? dy + 1 : 0) - words.length + 1 : 1;
                opts.dy = offset + "em";
                opts.dx = dx / words.length + "ex";
                return <tspan key={index} {...opts}>{word}</tspan>;
            });
        }

        return <tspan {...opts}>{text}</tspan>;
    };

    var opts = {
        x: xPosition,
        y: yPosition,
        fontSize: 14,
        textAnchor: anchor,
        dominantBaseline: baseline
    };

    return (
        <g>
            <text {...opts}>
                {formatMultiline(value)}
            </text>
        </g>
    );
};

class MyScatterChart extends Component {

    render() {
        const shuffleData = skillsData.map(function (value, index) {
            const result = Object.assign({}, value);
            result.want = result.want + 2 * (Math.random() - 0.5);
            result.can = result.can + 2 * (Math.random() - 0.5);
            return result;
        });

        const minData = 0;
        const maxData = 100;
        const padData = 30;
        const ticks = [25, 50, 75];
        const noAxisTick = (x) => {
            return "";
        };
        return (
            <ScatterChart width={1000} height={800} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                <CartesianGrid strokeDasharray="20 20"/>
                <XAxis
                    type="number"
                    stroke={"#868686"}
                    domain={[minData, maxData]}
                    dataKey="can"
                    label="Proficiency"
                    allowDataOverlow={true}
                    padding={{right: padData}}
                    tickFormatter={noAxisTick}
                    ticks={ticks}
                />
                <YAxis
                    type="number"
                    stroke={"#868686"}
                    domain={[minData, maxData]}
                    dataKey="want"
                    label="Interest"
                    allowDataOverlow={true}
                    padding={{top: padData}}
                    tickFormatter={noAxisTick}
                    ticks={ticks}
                />
                <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                <Scatter name='Skills' data={shuffleData} fill={"#479fd8"} shape="circle">
                    <LabelList dataKey="name" position="top" content={renderCustomizedLabel}/>
                </Scatter>
            </ScatterChart>
        )
    }
}

export default MyScatterChart;