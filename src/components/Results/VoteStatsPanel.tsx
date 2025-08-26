"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/base/ui/button";
import { X } from "lucide-react";

type ChoiceData = {
  count: number;
  sub: { title: string };
  percentage?: number;
};

interface VoteStatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChoice: ChoiceData | null;
  totalVotes: number;
}

export const VoteStatsPanel: React.FC<VoteStatsPanelProps> = ({
  isOpen,
  onClose,
  selectedChoice,
  totalVotes,
}) => {
  if (!selectedChoice) return null;

  const percentage = totalVotes > 0 ? (selectedChoice.count / totalVotes) * 100 : 0;
  const roundedPercentage = Math.round(percentage);

  return (
    <>
      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 bg-background border-l transition-transform duration-300 ease-in-out",
          // Mobile: full screen
          "inset-y-0 right-0 w-full sm:w-96",
          // Desktop: side panel
          "sm:inset-y-0 sm:right-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-light font-serif">Vote Statistics</h2>
            <Button
              variant="default"
              size="default"
              onClick={onClose}
              className="p-2 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-8">
            {/* Choice Title */}
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-light">Choice</h3>
              <p className="text-2xl font-light font-sans uppercase tracking-wide">
                {selectedChoice.sub.title}
              </p>
            </div>

            {/* Statistics */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-serif font-light">Statistics</h4>
                
                {/* Vote Count */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-sans font-light uppercase text-sm">Total Votes</span>
                  <span className="text-xl font-light">
                    {selectedChoice.count} {selectedChoice.count === 1 ? 'person' : 'people'}
                  </span>
                </div>

                {/* Percentage */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-sans font-light uppercase text-sm">Percentage</span>
                  <span className="text-xl font-light">{roundedPercentage}%</span>
                </div>

                {/* Total Participants */}
                <div className="flex justify-between items-center py-3">
                  <span className="font-sans font-light uppercase text-sm">Total Participants</span>
                  <span className="text-xl font-light">{totalVotes}</span>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="space-y-4">
                <h4 className="text-lg font-serif font-light">Visual Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-light uppercase text-sm">Selected Choice</span>
                    <span className="font-light">{roundedPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${roundedPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-light uppercase text-sm">Other Choices</span>
                    <span className="font-light">{100 - roundedPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-lg font-serif font-light">About</h4>
              <p className="text-sm font-light text-gray-600">
                This choice represents {roundedPercentage}% of all responses. 
                {selectedChoice.count === 1 
                  ? ' One person chose this option.'
                  : ` ${selectedChoice.count} people chose this option.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};