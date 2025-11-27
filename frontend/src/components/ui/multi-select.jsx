"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

export default function MultiSelect({
    items = [],
    optionLabel = null,
    optionValue = null,
    initialSelected = [],
    activeFields, setActiveFields
}) {
    const [open, setOpen] = useState(false);
    const [s, setSelected] = useState(activeFields);
    const selected = activeFields ?? s;

    // Apply initial checked values
    useEffect(() => {
        if (initialSelected && Array.isArray(initialSelected)) {
            setSelected(initialSelected);
        }
    }, [initialSelected]);

    const getLabel = (item) => {
        const label = optionLabel ? item[optionLabel] : item;
        return String(label);
    };

    const getValue = (item) => {
        return optionValue ? item[optionValue] : item;
    };

    const toggleOption = (item) => {
        const value = getValue(item);
        const updaterFunc = setActiveFields ?? selectedLabels

        updaterFunc((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    // Labels of selected values (based on actual items)
    const selectedLabels = items
        .filter((item) => selected.includes(getValue(item)))
        .map((item) => getLabel(item));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="min-w-64  w-fit justify-between"
                >
                    {selectedLabels.length > 0
                        ? selectedLabels.join(", ")
                        : "Select options"}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-0">
                <Command>
                    {items?.length === 0 ? (
                        <CommandItem>Options not available</CommandItem>
                    ) : (
                        <CommandList>
                            <CommandGroup>
                                {items.map((item, idx) => {
                                    const label = getLabel(item);
                                    const value = getValue(item);

                                    return (
                                        <CommandItem
                                            key={value + "-" + idx}
                                            onSelect={() => toggleOption(item)}
                                        >
                                            <Checkbox
                                                checked={selected.includes(value)}
                                                className="mr-2 active:bg-sky-400"
                                            />

                                            {toSentenceCase(label)}

                                            {selected.includes(value) && (
                                                <Check className="ml-auto h-4 w-4" />
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function toSentenceCase(str) {
    if (!str) return "";
    str = String(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
}
