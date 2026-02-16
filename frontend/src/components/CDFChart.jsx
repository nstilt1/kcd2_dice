"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function CDFChart({ scores }) {
    const ref = useRef(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 450;

        const margin = { top: 40, right: 30, bottom: 60, left: 70 };

        const sorted = [...scores].sort((a, b) => a - b);

        const x = d3.scaleLinear()
            .domain(d3.extent(sorted))
            .nice()
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margin.bottom, margin.top]);

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        // CDF line
        const line = d3.line()
            .x((d, i) => x(d))
            .y((d, i) => y((i + 1) / sorted.length));

        svg.append("path")
            .datum(sorted)
            .attr("fill", "none")
            .attr("stroke", "#4f46e5")
            .attr("stroke-width", 2)
            .attr("d", line);

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
            .text("Cumulative Probability");

        // Title
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", margin.top / 1.5)
            .style("font-size", "18px")
            .style("font-weight", "600")
            .text("Cumulative Distribution Function");
    }, [scores]);

    return (
        <Card className="mb-2 mt-2 w-full">
            <CardHeader>
                <CardTitle>Cumulative Distribution Function of Maximum Score in a Single Turn</CardTitle>
                <CardDescription>Simulated with a uniformly pseudorandom RNG.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <svg ref={ref} width={800} height={450} className="w-full max-w-full h-auto block"></svg>
                </div>
            </CardContent>
        </Card>
    );
}
