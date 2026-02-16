import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Histogram({ scores }) {
    const ref = useRef(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 450;

        // Larger margins so labels never overlap
        const margin = { top: 40, right: 30, bottom: 60, left: 70 };

        const x = d3.scaleLinear()
            .domain(d3.extent(scores))
            .nice()
            .range([margin.left, width - margin.right]);

        const bins = d3.bin()
            .domain(x.domain())
            .thresholds(40)(scores);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        // Bars
        svg.append("g")
            .selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("x", d => x(d.x0) + 1)
            .attr("y", d => y(d.length))
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", d => y(0) - y(d.length))
            .attr("fill", "#4f46e5");

        // X axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        // X label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 2)
            .style("font-size", "14px")
            .text("Score");

        // Y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Y label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", margin.left / 2)
            .style("font-size", "14px")
            .text("Frequency");

        // Title
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", margin.top / 1.5)
            .style("font-size", "18px")
            .style("font-weight", "600")
            .text("Histogram of Scores");
    }, [scores]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Histogram of Maximum Score in a Single Turn</CardTitle>
                <CardDescription>Simulated with a uniformly pseudorandom RNG.</CardDescription>
            </CardHeader>
            <CardContent>
                <svg ref={ref}></svg>
            </CardContent>
        </Card>
    );
}
