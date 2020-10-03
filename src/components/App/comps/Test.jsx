import React, { Component } from 'react'
import Chart from "chart.js";
// import classes from "./LineGraph.module.css";

export default class LineGraph extends Component {
    chartRef = React.createRef();
    
    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");
        
        this.variable = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: ["Jan", "Feb", "March", '', '', '',''],
                datasets: [
                    {
                        label: "Sales",
                        data: [91,null,101,200,null,101,90],
                    }
                ] 
            },
            options: {
                //Customize chart options
            }
        });
    }
    render() {

        const changeVals = () => {
            console.log(this.variable);
            this.variable.data.datasets = [
                {
                    label: "nigga you tripping",
                    data: [69, 69, 69],
                }
            ];
            this.variable.update();
        }

        return (
            <div>
                <button onClick={changeVals}>CLICK ME</button>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}