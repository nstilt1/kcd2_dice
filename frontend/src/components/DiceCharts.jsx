"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react';
import MidiPlayer from "./MidiPlayer";
import ChatBar from "./ChatBar";
import Selector from "./Selector";
import NumberInput from "./NumberInput";
import MultiSelect from "./MultiSelector";
import useLocalStorage from "@/hooks/useLocalStorage";

import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./ui/tooltip";
import DropdownWithNavigation from "./DropdownWithNavigation";
import Histogram from "@/components/Histogram";
import CDFChart from "@/components/CDFChart";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {debugLog} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Separator} from "./ui/separator";

export function percentile(arr, p) {
  const n = arr.length;
  if (n === 0) return undefined;

  const index = (p / 100) * (n - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return arr[lower];
  }

  const weight = index - lower;
  return arr[lower] * (1 - weight) + arr[upper] * weight;
}


const DiceCharts = ({
  wasmModule,
    dice,
    sanitizedDice,
}) => {
  const [textInput, setTextInput] = useLocalStorage("textInput", '');
  const [mode, setMode] = useLocalStorage("mode", "melody");
  const [useSameChords, setUseSameChords] = useLocalStorage("useSameChords", true);
  const [midiFile, setMidiFile] = useState(null);
  const [numChords, setNumChords] = useLocalStorage("numChords", 20);
  const [sanitizedNumChords, setSanitizedNumChords] = useLocalStorage("sanitizedNumChords", 20);
  const [vibe, setVibe] = useLocalStorage("vibe", 'default');
  const [chord_picking_method, setChordPickingMethod] = useLocalStorage("chord_picking_method", 'original');
  const [numUniqueChords, setNumUniqueChords] = useLocalStorage("numUniqueChords", 0);
  const [sanitizedNumUniqueChords, setSanitizedNumUniqueChords] = useLocalStorage("sanitizedNumUniqueChords", 0);
  const [savedChordsOpen, setSavedChordsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [isRandom, setIsRandom] = useLocalStorage("isRandom", true);
  const [patternToUse, setPatternToUse] = useLocalStorage("patternToUse", "--");
  const [duration, setDuration] = useLocalStorage("duration", 4);
  const [patterns, setPatterns] = useLocalStorage("patterns", ["--", "1-2-3-4", "1-1-2-3"]);

  const [die, setDie] = useLocalStorage("die", "");
  const [rngType, setRngType] = useLocalStorage("rng_type", 'ChaCha8Rng');
  const [numThrows, setNumThrows] = useLocalStorage("num_throws", 10000);

  // score until bust simulation
  const [mean, setMean] = useLocalStorage("mean", 0);
  const [min, setMin] = useLocalStorage("min", 0);
  const [max, setMax] = useLocalStorage("max", 10000);
  const [results, setResults] = useLocalStorage("results", []);

  // score and pass simulation
  const [mean2, setMean2] = useLocalStorage("mean2", 0);
  const [min2, setMin2] = useLocalStorage("min2", 0);
  const [max2, setMax2] = useLocalStorage("max2", 10000);
  const [results2, setResults2] = useLocalStorage("results2", []);
  
  const [value, setValue] = useLocalStorage("value", "");
  const [sanitizedNumThrows, setSanitizedNumThrows] = useLocalStorage("sanitizedNumChords", 10000);

  const [minDiceThreshold, setDiceThreshold] = useLocalStorage("diceThreshhold", 1);
  const [sanitizedDiceThreshold, setSanitizedDiceThreshold] = useLocalStorage("sanitizedDiceThreshold", 1);
  const [minScore, setMinScore] = useLocalStorage("minScore", 1000);
  const [sanitizedMinScore, setSanitizedMinScore] = useLocalStorage("sanitizedMinScore", 1000);
const [targetScore, setTargetScore] = useLocalStorage("targetScore", 8000);
  // Function to save current form settings
  const saveCurrentSettings = (name) => {
    const settingsToSave = {
      chosenKey,
      chordGroup,
      customChords,
      scale,
      textInput,
      mode,
      useSameChords,
      sanitizedNumChords,
      numChords,
      vibe,
      chord_picking_method,
      numUniqueChords,
      sanitizedNumUniqueChords,
      isRandom,
      patternToUse,
      duration,
    };
  
    // Use useLocalStorage to save
    const savedProgressions = JSON.parse(localStorage.getItem('savedProgressions') || '{}');
    savedProgressions[name] = {
      type: 'generated',
      contents: settingsToSave,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedProgressions', JSON.stringify(savedProgressions));
  };

  // Function to load saved settings
  const handleLoadSettings = (settings) => {
    // Update each state variable from the loaded settings
    setKey(settings.chosenKey);
    setChordGroup(settings.chordGroup);
    handleChordTypeSelection(settings.customChords);
    setScale(settings.scale);
    setTextInput(settings.textInput);
    setMode(settings.mode);
    setUseSameChords(settings.useSameChords);
    setNumChords(settings.numChords);
    setSanitizedNumChords(settings.sanitizedNumChords);
    setVibe(settings.vibe);
    setChordPickingMethod(settings.chord_picking_method);
    setNumUniqueChords(settings.numUniqueChords);
    setSanitizedNumUniqueChords(settings.sanitizedNumUniqueChords);
    setIsRandom(settings.isRandom);
    if(settings.pattern) {
      setPatternToUse(settings.pattern);
    } else {
      setPatternToUse("");
    }
    if(settings.duration) {
      setDuration(settings.duration);
    } else {
      setDuration(4);
    }
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  }

  const handleUseSameChordsChange = (event) => {
    setUseSameChords(!useSameChords);
  }

  const handleNumThrowsChange = (value) => {
    // ensure the number stored in `numChords` is greater than 0
    setNumThrows(value);
    if (value > 0) {
      setSanitizedNumThrows(Math.round(value));
    }
  }

  const handleDiceThresholdChange = (value) => {
    // ensure the number stored in `numChords` is greater than 0
    setDiceThreshold(value);
    if (value > 0) {
      setSanitizedDiceThreshold(Math.round(value));
    }
  }

  const handleMinScoreChange = (value) => {
    // ensure the number stored in `numChords` is greater than 0
    setMinScore(value);
    if (value > 0) {
      setSanitizedMinScore(Math.round(value));
    }
  }

  const handleNumUniqueChordsChange = (value) => {
    setNumUniqueChords(value);
    if (value >= 0) {
      setSanitizedNumUniqueChords(Math.round(value));
    }
  }

  const handleTargetScoreChange = (value) => {
    setDuration(value);
    if (value > 0) {
      setDuration(Math.round(value));
    }
  }

  const handleIsRandomChange = (event) => {
    setIsRandom(!isRandom);
  }

  useEffect(() => {
    console.log("DiceCharts wasmModule:", wasmModule);
  }, [wasmModule]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!wasmModule) {
      console.warn("WASM not ready yet");
      return;
    }

    // optional: also ensure export exists
    if (typeof wasmModule.analyze_dice !== "function") {
      console.error("analyze_dice not exported on wasmModule", Object.keys(wasmModule));
      return;
    }

    if(!textInput) {
      alert("Please provide an input seed.");
      return;
    }

    if(!die) {
      alert("Please select a die.");
      return;
    }

    if (sanitizedMinScore < 0 || !sanitizedMinScore) {
      alert("Please input a minimum score.");
      return;
    }

    if (sanitizedDiceThreshold <= 0 || sanitizedDiceThreshold > 6) {
      alert("Dice Threshold must be at least 1 and less than 6");
      return;
    }

    try {
      let d = sanitizedDice.find(d => d.name === die);
      console.time("simulate_dice");
      const data = wasmModule.analyze_dice(
          textInput,
          rngType,
          sanitizedNumThrows,
          d.probabilities[0],
          d.probabilities[1],
          d.probabilities[2],
          d.probabilities[3],
          d.probabilities[4],
          d.probabilities[5],
          sanitizedDiceThreshold,
          sanitizedMinScore,
          true,
          targetScore,
      );
      console.timeEnd("simulate_dice");

      const r = data.max_possible_scores;
      setMean(r.mean);
      setMin(r.minimum);
      setMax(r.maximum);
      setResults(r.results);
      const rr = data.max_scores_with_conditional_pass;
      setMean2(rr.mean);
      setMin2(rr.minimum);
      setMax2(rr.maximum);
      setResults2(rr.results);

      console.log(results);
      console.log(mean);
    } catch (error) {
      console.error("Error processing file", error);
      alert("An error occurred while generating the MIDI file.");
    }
  };

  const vibes = [
    { label: "Default vibe", value: "default"},
    { label: "Vibe 1", value: "1" },
    { label: "Vibe 2", value: "2" },
    { label: "Vibe 3", value: "3" },
    { label: "Vibe 4", value: "4" },
    { label: "Vibe 5", value: "5" },
    { label: "Vibe 6", value: "6" },
    { label: "Vibe 7", value: "7" },
    { label: "Vibe 8", value: "8" },
    { label: "Vibe 9", value: "9" },
    { label: "Vibe 10", value: "10" }
  ];

  const chordPickingMethods = [
    { label: "Original - 2D", value: "original" },
    { label: "1D", value: "1D" }
  ];

  const modes = [
    { label: "Melody", value: "melody" },
    { label: "Chords", value: "chords" },
    { label: "Melody v2", value: "melody v2" },
    { label: "Melody v3", value: "melody v3" },
    { label: "Intended Placement", value: "intended" }
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div>
          <h4>Scoring Parameters</h4>
          <Select
            onValueChange={(val) => {
              setValue(val);
              setDie(val);
              debugLog(val);
              debugLog(die);
            }}
          >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a die" />
          </SelectTrigger>

          <SelectContent>
            {dice.map((d, i) => (
                <SelectItem key={d.name} value={d.name}>
                  <div className="flex flex-col">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-sm text-muted-foreground">
                {d.probabilities}
              </span>
                  </div>
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="w-full text-left"><div>
                <NumberInput
                    value={numThrows}
                    onChange={handleNumThrowsChange}
                    id="numTurns"
                    labelText="# of turns:"
                />
              </div></TooltipTrigger>
              <TooltipContent>
                <p className="text-lg max-w-md">
                  Determines the number of turns in the sample space.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Separator className="m-1" />
          <h4>Score and Pass Parameters</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="w-full text-left"><div>
                <NumberInput
                    value={minDiceThreshold}
                    onChange={handleDiceThresholdChange}
                    id="diceThreshold"
                    labelText="Dice threshold for passing:"
                />
              </div></TooltipTrigger>
              <TooltipContent>
                <p className="text-lg max-w-md">
                  Determines the dice limit for passing, which is conditional on the minimum score.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="w-full text-left"><div>
                <NumberInput
                    value={minScore}
                    onChange={handleMinScoreChange}
                    id="minScore"
                    labelText="Minimum score to pass at <= diceThreshold dice:"
                />
              </div></TooltipTrigger>
              <TooltipContent>
                <p className="text-lg max-w-md">
                  Determines the minimum score to pass when the dice threshold is met.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="w-full text-left"><div>
                <NumberInput
                    value={targetScore}
                    onChange={handleTargetScoreChange}
                    id="targetScore"
                    labelText="Target score for passing:"
                />
              </div></TooltipTrigger>
              <TooltipContent>
                <p className="text-lg max-w-md">
                  The simulator will automatically pass when this score is reached.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Separator className="m-1 mb-3" />
        </div>

        <div>
          <ChatBar
              onSubmit={handleSubmit}
              onTextChange={handleTextChange}
              fileInputRef={fileInputRef}
              textInput={textInput}
          />
        </div>
        <div>
          {results.length > 0 && (
              <>
                <Card className="w-full mb-2">
                  <CardHeader>
                    <CardTitle>Maximum Score Simulation</CardTitle>
                    <CardDescription>Simulates &quot;Score and Continue&quot; until busting.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Mean = {mean}</p>
                    <p>Min = {min}</p>
                    <p>25th percentile = {percentile(results, 25)}</p>
                    <p>50th percentile = {percentile(results, 50)}</p>
                    <p>75th percentile = {percentile(results, 75)}</p>
                    <p>Max = {max}</p>
                    <Histogram scores={results} label="Max Score in a Single Turn Histogram"/>
                    <CDFChart scores={results} label="Max Score in a Single Turn CDF Chart"/>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Maximum Score Simulation with Passing</CardTitle>
                    <CardDescription>Simulates &quot;Score and Continue&quot; until numDice &le; diceThreshold ({minDiceThreshold}) and score &ge; minScore ({minScore}).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Mean = {mean2}</p>
                    <p>Min = {min2}</p>
                    <p>25th percentile = {percentile(results2, 25)}</p>
                    <p>50th percentile = {percentile(results2, 50)}</p>
                    <p>75th percentile = {percentile(results2, 75)}</p>
                    <p>Max = {max2}</p>
                    <Histogram scores={results2} label="Max Score in a Single Turn Histogram"/>
                    <CDFChart scores={results2} label="Max Score in a Single Turn CDF Chart"/>
                  </CardContent>
                </Card>
              </>
          )}
          {/*
          <div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                  <Selector 
                    options={modes}
                    selectedOption={mode}
                    onChange={setMode}
                    label="Choose a mode:"
                  />
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    The modes represent different chord placement algorithms.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                  <input 
                    type="checkbox"
                    id="useSameChords"
                    checked={useSameChords}
                    onChange={handleUseSameChordsChange}
                  />
                  <label htmlFor="useSameChords">Use same chords for all modes?</label>
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    When checked, this ensures that the same exact set of chords 
                    will be used when generating chords with different modes. 
                    Otherwise, the chords will likely be different.
                  </p>
                  <p className="text-lg max-w-md">
                    This is primarily useful for comparing the different chord 
                    placement algorithms (modes).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                <NumberInput
                  value={numChords}
                  onChange={handleNumChordsChange}
                  id="numChords"
                  labelText="# of chords:"
                />
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    Determines the number of chords that will be generated and 
                    placed into the MIDI file.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                  <NumberInput
                    value={numUniqueChords}
                    onChange={handleNumUniqueChordsChange}
                    id="numUniqueChords"
                    labelText="# unique chords:"
                  />
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    This setting attempts to ensure that the last N chords will 
                    be unique. There are some situations where there will be duplicate 
                    chords, such as when the value in the &quot;# unique chords&quot; 
                    is greater than the total amount of chords to pick from.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                  <Selector 
                    options={keys} 
                    selectedOption={chosenKey}
                    onChange={setKey}
                    label="Choose a key:"
                  />
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    This determines what key that the generated MIDI is supposed 
                    to be in.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                <Selector 
                  options={chordGroups}
                  selectedOption={chordGroup}
                  onChange={setChordGroup}
                  label="Choose a chord group:"
                />
                {(chordGroup == "custom" || chordGroup == "custom_pruning") && <MultiSelect
                  options={customChordTypes}
                  selectedOptions={customChords}
                  setSelectedOptions={handleChordTypeSelection}
                />}
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    The chord group determines which chords will be included in 
                    the initial vocabulary before pruning. You can view the chords 
                    in the vocabulary using the &quot;Chord Vocabulary&quot; menu.
                  </p>
                  <p className="text-lg max-w-md">
                    The Custom chord groups require you to select which chord types 
                    to be included. The Custom (use pruning) chord group initializes 
                    the vocabulary to have every possible chord with all roots. This 
                    is supposed to be pruned to a specific scale so as to find the 
                    potential chords of a key.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                  <Selector
                    options={chordPickingMethods}
                    selectedOption={chord_picking_method}
                    onChange={setChordPickingMethod}
                    label="Choose a chord picking method:"
                  />
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    Test different chord picking methods. The 2D method picks a 
                    random column in the Chord Table, then picks a random chord in 
                    that column.
                  </p>
                  <p className="text-lg max-w-md">
                    The 1D method simply picks a random chord from the Chord List.
                  </p>
                  <p className="text-lg max-w-md">
                    The probability of each chord being picked can be observed in 
                    the Chord Vocabulary menu. The Chord Table used by the MIDI 
                    Machine is arranged by &quot;Contains note&quot; if you want to see the 
                    same exact probabilities as the ones that are present in the 
                    MIDI Machine&apos;s output.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                  <Selector 
                    options={scales}
                    selectedOption={scale}
                    onChange={setScale}
                    label="Prune chords to fit this scale:"
                  />
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    Pruning chords removes all chords from the chord table that contain 
                    notes that are outside of the given scale. This theoretically can 
                    ensure that the resulting chords will all be in key.
                  </p>
                  <p className="text-lg max-w-md">
                    The &quot;No pruning, but clone chords with optional notes&quot; option copies 
                    chords that were defined with optional notes so that different variations 
                    of chords may show up in the chord table.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {(scale == "all_notes" || scale == "disabled") && chordGroup == "custom_pruning" && 
            <div className="w-full max-w-sm">
              <p className="text-red-500">
                The &quot;Custom (use pruning)&quot; chord group is intended to be used with pruning. 
                You are welcome to try it without pruning, but it will likely be 
                unsatisfactory because the chords will probably not be in a 
                specific key.
              </p>
            </div>}
            {scale != "disabled" && 
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="w-full text-left"><div>
                    <input 
                      type="checkbox"
                      id="isReproducible"
                      checked={isRandom}
                      onChange={handleIsRandomChange}
                    />
                    <label htmlFor="isReproducible">Randomize output? (Not reproducible)</label>
                  </div></TooltipTrigger>
                  <TooltipContent>
                    <p className="text-lg max-w-md">
                      This checkbox can partially randomize the output and is not 
                      very reproducible. This works by <b>not</b> sorting an array 
                      created from a Hash Set, which is in a random order.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
            </div>}
            {/* Duration and Patterns/sequences
            {false && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="w-full text-left"><div>
                <NumberInput
                  value={duration}
                  onChange={handleDurationChange}
                  id="duration"
                  labelText="Max duration of each chord (in beats):"
                />
                </div></TooltipTrigger>
                <TooltipContent>
                  <p className="text-lg max-w-md">
                    Determines the maximum amount of beats for each bar&apos;s 
                    chord. This should be less than 4, and the played chord will 
                    only last for 1 bar before it switches to the next chord.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            )}
            </div>
            
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="w-full text-left"><div>
                <Selector
                  options={vibes}
                  selectedOption={vibe}
                  onChange={setVibe}
                  label="Choose a vibe:"
                />
              </div></TooltipTrigger>
              <TooltipContent>
                <p className="text-lg max-w-md">
                  The vibe selector is a way to try to choose a completely different 
                  vibe and set of chords.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          */}
        </div>
        {/*
        <DropdownWithNavigation
              value={patternToUse}
              setValue={setPatternToUse}
              options={patterns}
              setOptions={setPatterns}
              id="pattern"
              labelText="The pattern/sequence to use:"
              enabled={useSameChords && mode === "chords"}
            />
            */}
      </form>
    </div>
  );
};

export default DiceCharts;