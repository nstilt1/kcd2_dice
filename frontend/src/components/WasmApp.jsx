"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DiceCharts from './DiceCharts';
import CheatSheet from './CheatSheet';
import ChordFinder from './ChordFinder';
import BustProbabilities from "@/components/BustProbabilities";
import BruteForceBestTarget from "@/components/BruteForceBestTarget";

const WasmApp = ({ showExtraControls, cpbRef, wasmModule, toggleExtraControls }) => {
  const [key, setKey] = useLocalStorage("key", 'random');
  const [chordGroup, setChordGroup] = useLocalStorage("chordGroup", 'default');
  const [customChords, setCustomChords] = useLocalStorage("customChords", []);
  const [scale, setScale] = useLocalStorage("scale", "disabled");
  const [tableScheme, setTableScheme] = useLocalStorage("tableScheme", "contains_note");

  const handleChordTypeSelection = (option) => {
    if (customChords.includes(option)) {
      setCustomChords(customChords.filter((item) => item !== option));
    } else {
      setCustomChords([...customChords, option]);
    }
  };

  const keys = [
    { label: "Any key", value: "random" },
    { label: "C minor", value: "Cmin" },
    { label: "C# minor", value: "C#min" },
    { label: "D minor", value: "Dmin" },
    { label: "D# minor", value: "D#min" },
    { label: "E minor", value: "Emin" },
    { label: "F minor", value: "Fmin" },
    { label: "F# minor", value: "F#min" },
    { label: "G minor", value: "Gmin" },
    { label: "G# minor", value: "G#min" },
    { label: "A minor", value: "Amin" },
    { label: "A# minor", value: "A#min" },
    { label: "B minor", value: "Bmin" },
    { label: "C major", value: "Cmaj" },
    { label: "C# major", value: "C#maj" },
    { label: "D major", value: "Dmaj" },
    { label: "D# major", value: "D#maj" },
    { label: "E major", value: "Emaj" },
    { label: "F major", value: "Fmaj" },
    { label: "F# major", value: "F#maj" },
    { label: "G major", value: "Gmaj" },
    { label: "G# major", value: "G#maj" },
    { label: "A major", value: "Amaj" },
    { label: "A# major", value: "A#maj" },
    { label: "B minor", value: "Bmaj" }
  ];

  const chordGroups = [
    { label: "Default", value: "default" },
    { label: "Original", value: "original" },
    { label: "Custom (hand-picked)", value: "custom" },
    { label: "Custom (use pruning)", value: "custom_pruning" }
  ];

  const customChordTypes = [
    "major",
    "minor",
    "minor7",
    "major7",
    "diminished",
    "augmented",
    "major6",
    "minor6",
    "major9",
    "minor9",
    "major7sharp9",
    "major7flat5sharp9",
    "major9flat5",
    "major7flat9",
    "major13",
    "dominant9",
    "add9"
  ];

  const scales = [
    { label: "Disable chord pruning", value: "disabled" },
    { label: "Natural", value: "natural" },
    { label: "Melodic", value: "melodic" },
    { label: "Harmonic", value: "harmonic" },
    { label: "Pentatonic", value: "pentatonic" },
    { label: "Romanian", value: "romanian" },
    { label: "Hungarian", value: "hungarian" },
    { label: "Half-Whole", value: "half_whole" },
    { label: "Whole-Half", value: "whole_half" },
    { label: "No pruning, but clone chords with optional notes", value: "all_notes" }
  ];

  const tableSchemes = [
    { label: "Contains note", value: "contains_note" },
    { label: "Highest note", value: "highest_note" },
    { label: "Lowest note", value: "lowest_note" }
  ];

  const dice = [
    { name: "Arkana's Die", probabilities: "28.6%\t4.8%\t28.6%\t4.8%\t28.6%\t4.8%"},
    { name: "Cautious Cheater's Die", probabilities: "23.8%\t14.3%\t9.5%\t14.3%\t23.8%\t14.3%"},
    { name: "Ci Die", probabilities: "13%\t13%\t13%\t13%\t13%\t34.8%"},
    { name: "Devil's Head Die", probabilities: "16.7%\t16.7%\t16.7%\t16.7%\t16.7%\t16.7%"},
    { name: "Die of Misfortune", probabilities: "4.5%\t27.7%\t27.7%\t27.7%\t27.7%\t4.5%"},
    { name: "Even Die", probabilities: "6.7%\t26.7%\t6.7%\t26.7%\t6.7%\t26.7%"},
    { name: "Favourable Die", probabilities: "33.3%\t0%\t5.6%\t5.6%\t33.3%\t22.2%"},
    { name: "Fer Die", probabilities: "13%\t13%\t13%\t13%\t13%\t34.8%"},
    { name: "Greasy Die", probabilities: "17.6%\t11.8%\t17.6%\t11.8%\t17.6%\t23.5%"},
    { name: "Grimy Die", probabilities: "6.2%\t31.2%\t6.2%\t6.2%\t43.7%\t6.2%"},
    { name: "Grosav's Lucky Die", probabilities: "6.7%\t66.7%\t6.7%\t6.7%\t6.7%\t6.7%"},
    { name: "Heavenly Kingdom Die", probabilities: "36.8%\t10.5%\t10.5%\t10.5%\t10.5%\t21%"},
    { name: "Holy Trinity Die", probabilities: "18.2%\t22.7%\t45.4%\t4.5%\t4.5%\t4.5%"},
    { name: "Hugo's Die", probabilities: "16.7%\t16.7%\t16.7%\t16.7%\t16.7%\t16.7%"},
    { name: "King's Die", probabilities: "12.5%\t18.7%\t21.9%\t25%\t12.5%\t9.4%"},
    { name: "Lousy Gambler's Die", probabilities: "10%\t15%\t10%\t15%\t35%\t15%"},
    { name: "Lu Die", probabilities: "13%\t13%\t13%\t13%\t13%\t34.8%"},
    { name: "Lucky Die", probabilities: "27.3%\t4.5%\t9.1%\t13.6%\t18.2%\t27.3%"},
    { name: "Mathematician's Die", probabilities: "16.7%\t20.8%\t25%\t29.2%\t4.2%\t4.2%"},
    { name: "Molar Die", probabilities: "16.7%\t16.7%\t16.7%\t16.7%\t16.7%\t16.7%"},
    { name: "Odd Die", probabilities: "26.7%\t6.7%\t26.7%\t6.7%\t26.7%\t6.7%"},
    { name: "Ordinary Die", probabilities: "16.7%\t16.7%\t16.7%\t16.7%\t16.7%\t16.7%"},
    { name: "Painted Die", probabilities: "18.7%\t6.2%\t6.2%\t6.2%\t43.7%\t18.7%"},
    { name: "Pie Die", probabilities: "46.2%\t7.7%\t23.1%\t23.1%\t0%\t0%"},
    { name: "Premolar Die", probabilities: "16.7%\t16.7%\t16.7%\t16.7%\t16.7%\t16.7%"},
    { name: "Sad Greaser's Die", probabilities: "26.1%\t26.1%\t4.3%\t4.3%\t26.1%\t13%"},
    { name: "Saint Antiochus' Die", probabilities: "20.0%\t6.7%\t40.0%\t6.7%\t6.7%\t20.0%"},
    { name: "Shrinking Die", probabilities: "22.2%\t11.1%\t11.1%\t11.1%\t11.1%\t33.3%"},
    { name: "St. Steven's Die", probabilities: "16.7%\t16.7%\t16.7%\t16.7%\t16.7%\t16.7%"},
    { name: "Strip Die", probabilities: "25%\t12.5%\t12.5%\t12.5%\t18.7%\t18.7%"},
    { name: "Trinity Die", probabilities: "12.5%\t6.2%\t56.2%\t6.2%\t12.5%\t6.2%"},
    { name: "Unbalanced Die", probabilities: "25%\t33.3%\t8.3%\t8.3%\t16.7%\t8.3%"},
    { name: "Unlucky Die", probabilities: "9.1%\t27.3%\t18.2%\t18.2%\t18.2%\t9.1%"},
    { name: "Wagoner's Die", probabilities: "5.6%\t27.8%\t33.3%\t11.1%\t11.1%\t11.1%"},
    { name: "Weighted Die", probabilities: "66.7%\t6.7%\t6.7%\t6.7%\t6.7%\t6.7%"},
    { name: "Wisdom Tooth Die", probabilities: "16.7%\t16.7%\t16.7%\t16.7%\t16.7%\t16.7%"},
  ];

  const sanitizedDice = () => {
    let result = dice.map(d => ({ ...d }));
    for (let i = 0; i < result.length; i++) {
      let p = result[i].probabilities.replaceAll('%', '');
      result[i].probabilities = p.split('\t').map(value => parseFloat(value));
    }
    return result;
  }

  return (
    <div>
      {wasmModule ? 
        <div>
          <Tabs defaultValue="charts" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="charts">Dice Simulations</TabsTrigger>
              <TabsTrigger value="cheat-sheet">Bust Probabilities</TabsTrigger>
              <TabsTrigger value="brute-force-target-score">Brute Force</TabsTrigger>
            </TabsList>
            <TabsContent value="charts" className="w-full">
              <Card className="w-full sm:max-w-full">
                <CardHeader>
                  <CardTitle>Dice Charts</CardTitle>
                </CardHeader>
                <CardContent>
              <DiceCharts
                wasmModule={wasmModule}
                dice={dice}
                sanitizedDice={sanitizedDice()}
              />
              </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cheat-sheet">
              <Card>
                <CardHeader>
                  <CardTitle>Bust Probabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <BustProbabilities
                    wasmModule={wasmModule}
                    dice={dice}
                    sanitizedDice={sanitizedDice()}
                  />

              </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="brute-force-target-score" className="w-full">
              <Card className="w-full sm:max-w-full">
                <CardHeader>
                  <CardTitle>Brute Force Optimal Target Score to Pass</CardTitle>
                </CardHeader>
                <CardContent>
                  <BruteForceBestTarget
                      wasmModule={wasmModule}
                      dice={dice}
                      sanitizedDice={sanitizedDice()}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div> : <p>Loading...</p>}
    </div>
  );
};

export default WasmApp;
