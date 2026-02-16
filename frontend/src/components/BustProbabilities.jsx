"use client";

import {useEffect, useState} from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
import {TableCaption} from "./ui/table";

export default function BustProbabilities({wasmModule, dice, sanitizedDice}) {
    const [results, setResults] = useState([]);
    const handleSubmit = async (event) => {

        let result = [];

        try {
            console.time("bust_probabilities");
            console.log(sanitizedDice);
            for (let i = 0; i < sanitizedDice.length; i++) {
                const d = sanitizedDice[i];
                const p = sanitizedDice[i].probabilities;
                const stats = wasmModule.dice_stats(p[0], p[1], p[2], p[3], p[4], p[5]).roll_probabilities;
                result.push({
                    name: d.name,
                    pBust1: stats[0].p_bust,
                    pBust2: stats[1].p_bust,
                    pBust3: stats[2].p_bust,
                    pBust4: stats[3].p_bust,
                    pBust5: stats[4].p_bust,
                    pBust6: stats[5].p_bust,
                });
            }

            console.timeEnd("bust_probabilities");

            setResults(result);
        } catch (error) {
            console.error("Error calculating probabilities", error);
            alert("An error occurred while calculating probabilities.");
        }
    };

    useEffect(() => {
        async function f() {
            await handleSubmit(null);
        }
        f();
    }, [])

    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });

    const sorted = [...results].sort((a, b) => {
        const { key, direction } = sortConfig;

        const valA = a[key];
        const valB = b[key];

        // Alphabetical sort for name
        if (key === "name") {
            return direction === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }

        // Numeric sort for p1–p6
        return direction === "asc" ? valA - valB : valB - valA;
    });

    const requestSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const sortIndicator = (key) => {
        if (sortConfig.key !== key) return "";
        return sortConfig.direction === "asc" ? "▲" : "▼";
    };

    return (
        <Table className="w-full">
            <TableCaption>Bust probabilities for each die</TableCaption>

            <TableHeader>
                <TableRow>
                    <TableHead
                        className="cursor-pointer select-none font-bold"
                        onClick={() => requestSort("name")}
                    >
                        Die {sortIndicator("name")}
                    </TableHead>

                    {["pBust1", "pBust2", "pBust3", "pBust4", "pBust5", "pBust6"].map((key) => (
                        <TableHead
                            key={key}
                            className="cursor-pointer select-none"
                            onClick={() => requestSort(key)}
                        >
                            {key.toUpperCase()} {sortIndicator(key)}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {sorted.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.pBust1.toPrecision(3)}</TableCell>
                        <TableCell>{row.pBust2.toPrecision(3)}</TableCell>
                        <TableCell>{row.pBust3.toPrecision(3)}</TableCell>
                        <TableCell>{row.pBust4.toPrecision(3)}</TableCell>
                        <TableCell>{row.pBust5.toPrecision(3)}</TableCell>
                        <TableCell>{row.pBust6.toPrecision(3)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
