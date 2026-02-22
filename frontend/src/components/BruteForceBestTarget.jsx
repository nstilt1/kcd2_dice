"use client";

import Image from "next/image";
import React, { useRef, useState } from 'react';
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
import { percentile } from "./DiceCharts";

const BruteForceBestTarget = ({
      wasmModule,
      dice,
      sanitizedDice,
  }) => {
    const [textInput, setTextInput] = useLocalStorage("textInput", '');

    const [die, setDie] = useLocalStorage("die", "");
    const [rngType, setRngType] = useLocalStorage("rng_type", 'ChaCha8Rng');
    const [numThrows, setNumThrows] = useLocalStorage("num_throws", 10000);

    // brute force best target score simulations - median
    const [mean3, setMean3] = useLocalStorage("mean3", 0);
    const [min3, setMin3] = useLocalStorage("min3", 0);
    const [max3, setMax3] = useLocalStorage("max3", 10000);
    const [results3, setResults3] = useLocalStorage("results3", []);
    const [bestTargetScore, setBestTargetScore] = useState(0);
    const [bestMedianDiceThreshold, setBestMedianDiceThreshold] = useState(0);

    // brute force best target score simulations - mean
    const [mean4, setMean4] = useLocalStorage("mean4", 0);
    const [min4, setMin4] = useLocalStorage("min4", 0);
    const [max4, setMax4] = useLocalStorage("max4", 10000);
    const [results4, setResults4] = useLocalStorage("results4", []);
    const [bestTargetScore2, setBestTargetScore2] = useState(0);
    const [bestMeanDiceThreshold, setBestMeanDiceThreshold] = useState(0);

    const [value, setValue] = useLocalStorage("value", "");
    const [sanitizedNumThrows, setSanitizedNumThrows] = useLocalStorage("sanitizedNumChords", 10000);

    const [minDiceThreshold, setDiceThreshold] = useLocalStorage("diceThreshhold", 1);
    const [sanitizedDiceThreshold, setSanitizedDiceThreshold] = useLocalStorage("sanitizedDiceThreshold", 1);
    const [minScore, setMinScore] = useLocalStorage("minScore", 1000);
    const [sanitizedMinScore, setSanitizedMinScore] = useLocalStorage("sanitizedMinScore", 1000);
    const [targetScore, setTargetScore] = useLocalStorage("targetScore", 8000);
    const [sanitizedTargetScore, setSanitizedTargetScore] = useLocalStorage("sanitizedTargetScore", 8000);
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

    const handleTargetScoreChange = (value) => {
        setTargetScore(value);
        if (value >= 0) {
            setSanitizedTargetScore(Math.round(value));
        }
    }

    const handleDurationChange = (value) => {
        setDuration(value);
        if (value > 0) {
            setDuration(Math.round(value));
        }
    }

    const handleIsRandomChange = (event) => {
        setIsRandom(!isRandom);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!wasmModule) {
          console.warn("WASM not ready yet");
          return;
        }

        // optional: also ensure export exists
        if (typeof wasmModule.brute_force !== "function") {
          console.error("brute_force not exported on wasmModule", Object.keys(wasmModule));
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

        try {
            let d = sanitizedDice.find(d => d.name === die);
            console.time("simulate_brute_force_dice");
            const r = wasmModule.brute_force(
                textInput,
                rngType,
                sanitizedNumThrows,
                sanitizedTargetScore,
                d.probabilities[0],
                d.probabilities[1],
                d.probabilities[2],
                d.probabilities[3],
                d.probabilities[4],
                d.probabilities[5]
            );
            console.timeEnd("simulate_brute_force_dice");

            const best_median_simulation = r.best_median_target_score_results;
            const best_mean_simulation = r.best_mean_target_score_results;
            setMean3(best_median_simulation.mean);
            setMin3(best_median_simulation.minimum);
            setMax3(best_median_simulation.maximum);
            setResults3(best_median_simulation.results);
            setBestTargetScore(r.best_median_target_score);
            setBestMedianDiceThreshold(r.best_median_dice_threshold);

            setMean4(best_mean_simulation.mean);
            setMin4(best_mean_simulation.minimum);
            setMax4(best_mean_simulation.maximum);
            setResults4(best_mean_simulation.results);
            setBestTargetScore2(r.best_mean_target_score);
            setBestMeanDiceThreshold(r.best_mean_dice_threshold);
        } catch (error) {
            console.error("Error processing file", error);
            alert("An error occurred while generating the MIDI file.");
        }
    }

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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild className="w-full text-left"><div>
                                <NumberInput
                                    value={targetScore}
                                    onChange={handleTargetScoreChange}
                                    id="targetScore"
                                    labelText="maximum score limit:"
                                />
                            </div></TooltipTrigger>
                            <TooltipContent>
                                <p className="text-lg max-w-md">
                                    Automatically passes once this score is reached.
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
                        fileInputRef={null}
                        textInput={textInput}
                    />
                </div>
                <div>
                    {results3.length > 0 && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Maximum Median Score Simulation with Passing</CardTitle>
                                    <CardDescription>Simulates &quot;Score and Continue&quot; until numDice &le; diceThreshold ({bestMedianDiceThreshold}) and score &ge; mostOptimalMinScore ({bestTargetScore}).</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Mean = {mean3}</p>
                                    <p>Min = {min3}</p>
                                    <p>25th percentile = {percentile(results3, 25)}</p>
                                    <p>50th percentile = {percentile(results3, 50)}</p>
                                    <p>75th percentile = {percentile(results3, 75)}</p>
                                    <p>Max = {max3}</p>
                                    <Histogram scores={results3} label="Max Score in a Single Turn Histogram"/>
                                    <CDFChart scores={results3} label="Max Score in a Single Turn CDF Chart"/>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Maximum Mean Score Simulation with Passing</CardTitle>
                                    <CardDescription>Simulates &quot;Score and Continue&quot; until numDice &le; diceThreshold ({bestMeanDiceThreshold}) and score &ge; mostOptimalMinScore ({bestTargetScore2}).</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Mean = {mean4}</p>
                                    <p>Min = {min4}</p>
                                    <p>25th percentile = {percentile(results4, 25)}</p>
                                    <p>50th percentile = {percentile(results4, 50)}</p>
                                    <p>75th percentile = {percentile(results4, 75)}</p>
                                    <p>Max = {max4}</p>
                                    <Histogram scores={results4} label="Max Score in a Single Turn Histogram"/>
                                    <CDFChart scores={results4} label="Max Score in a Single Turn CDF Chart"/>
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

export default BruteForceBestTarget;