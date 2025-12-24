import React, { useState, useRef, useCallback, useEffect } from "react";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  onChangeEnd?: (value: number | [number, number]) => void;
  disabled?: boolean;
  showTooltip?: boolean;
  showSteps?: boolean;
  label?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  onChangeEnd,
  disabled = false,
  showTooltip = false,
  showSteps = false,
  label,
  className = "",
}) => {
  const isRange = Array.isArray(controlledValue) || Array.isArray(defaultValue);
  const initialValue = controlledValue ?? defaultValue;

  const [value, setValue] = useState<number | [number, number]>(initialValue);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const clamp = (val: number) => Math.min(Math.max(val, min), max);

  const snapToStep = (val: number) => Math.round(val / step) * step;

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const rawValue = percent * (max - min) + min;
      return snapToStep(clamp(rawValue));
    },
    [min, max, step]
  );

  const updateValue = useCallback(
    (newVal: number, thumbIndex: number | null) => {
      if (isRange && Array.isArray(value)) {
        const [low, high] = value;
        let newValue: [number, number];

        if (thumbIndex === 0) {
          newValue = [Math.min(newVal, high), high];
        } else if (thumbIndex === 1) {
          newValue = [low, Math.max(newVal, low)];
        } else {
          // Clicked on track - determine which thumb to move
          const distToLow = Math.abs(newVal - low);
          const distToHigh = Math.abs(newVal - high);
          if (distToLow < distToHigh) {
            newValue = [newVal, high];
            setActiveThumb(0);
          } else {
            newValue = [low, newVal];
            setActiveThumb(1);
          }
        }

        setValue(newValue);
        onChange?.(newValue);
      } else {
        setValue(newVal);
        onChange?.(newVal);
      }
    },
    [value, isRange, onChange]
  );

  const handleThumbMouseDown = (e: React.MouseEvent, thumbIndex: number) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    setActiveThumb(thumbIndex);

    const newVal = getValueFromPosition(e.clientX);
    updateValue(newVal, thumbIndex);
  };

  const handleThumbTouchStart = (e: React.TouchEvent, thumbIndex: number) => {
    if (disabled) return;
    e.stopPropagation();
    isDraggingRef.current = true;
    setActiveThumb(thumbIndex);

    const newVal = getValueFromPosition(e.touches[0].clientX);
    updateValue(newVal, thumbIndex);
  };

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    isDraggingRef.current = true;

    const newVal = getValueFromPosition(e.clientX);
    updateValue(newVal, null);
  };

  const handleTrackTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    isDraggingRef.current = true;

    const newVal = getValueFromPosition(e.touches[0].clientX);
    updateValue(newVal, null);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || activeThumb === null) return;
      e.preventDefault();

      const newVal = getValueFromPosition(e.clientX);
      updateValue(newVal, activeThumb);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || activeThumb === null) return;
      e.preventDefault();

      const newVal = getValueFromPosition(e.touches[0].clientX);
      updateValue(newVal, activeThumb);
    };

    const handleEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        onChangeEnd?.(value);
        setActiveThumb(null);
      }
    };

    if (isDraggingRef.current) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [activeThumb, getValueFromPosition, updateValue, value, onChangeEnd]);

  const handleKeyDown = (e: React.KeyboardEvent, thumbIndex: number) => {
    if (disabled) return;

    let newValue: number | [number, number];

    if (isRange && Array.isArray(value)) {
      const [low, high] = value;
      const currentVal = thumbIndex === 0 ? low : high;
      let adjustedVal = currentVal;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          adjustedVal = clamp(currentVal + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          adjustedVal = clamp(currentVal - step);
          break;
        case "Home":
          e.preventDefault();
          adjustedVal = min;
          break;
        case "End":
          e.preventDefault();
          adjustedVal = max;
          break;
        default:
          return;
      }

      if (thumbIndex === 0) {
        newValue = [Math.min(adjustedVal, high), high];
      } else {
        newValue = [low, Math.max(adjustedVal, low)];
      }
    } else {
      const currentVal = typeof value === "number" ? value : min;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = clamp(currentVal + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = clamp(currentVal - step);
          break;
        case "Home":
          e.preventDefault();
          newValue = min;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }
    }

    setValue(newValue);
    onChange?.(newValue);
    onChangeEnd?.(newValue);
  };

  const values = Array.isArray(value) ? value : [value];
  const percentages = values.map((v) => ((v - min) / (max - min)) * 100);

  const steps = showSteps
    ? Array.from(
        { length: Math.floor((max - min) / step) + 1 },
        (_, i) => min + i * step
      )
    : [];

  const fillStart = isRange ? percentages[0] : 0;
  const fillWidth = isRange ? percentages[1] - percentages[0] : percentages[0];

  return (
    <div className={`w-full py-2 ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4">
        <div
          ref={trackRef}
          className={`relative flex-1 h-4 bg-muted-foreground rounded-full ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          onMouseDown={handleTrackMouseDown}
          onTouchStart={handleTrackTouchStart}
        >
          {/* Fill */}
          <div
            className={`absolute h-4  ${
              disabled ? "bg-gray-400" : "bg-primary"
            }`}
            style={{
              left: `${fillStart}%`,
              width: `${fillWidth}%`,
            }}
          />

          {/* Steps */}
          {showSteps &&
            steps.map((stepValue) => {
              const stepPercent = ((stepValue - min) / (max - min)) * 100;
              return (
                <div
                  key={stepValue}
                  className="absolute top-1/2 w-0.5 h-2.5 bg-gray-400 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${stepPercent}%` }}
                />
              );
            })}

          {/* Thumbs */}
          {values.map((val, idx) => {
            const percent = percentages[idx];
            const isActive = activeThumb === idx;
            const isHovered = hoveredThumb === idx;
            const showThumbTooltip = showTooltip && (isActive || isHovered);

            return (
              <div
                key={idx}
                tabIndex={disabled ? -1 : 0}
                role="slider"
                aria-valuenow={val}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-disabled={disabled}
                aria-label={`${label || "slider"} thumb ${idx + 1}`}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onMouseDown={(e) => handleThumbMouseDown(e, idx)}
                onTouchStart={(e) => handleThumbTouchStart(e, idx)}
                onMouseEnter={() => setHoveredThumb(idx)}
                onMouseLeave={() => setHoveredThumb(null)}
                className={`absolute top-1/2 w-4 h-4 bg-background border-2 rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10 ${
                  disabled
                    ? "cursor-not-allowed border-gray-400"
                    : "cursor-grab border-primary"
                } ${isActive ? "cursor-grabbing scale-110 shadow-lg" : ""}`}
                style={{ left: `${percent}%` }}
              >
                {showThumbTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 border-[1.5px] border-gray-300 bg-background text-text-primary text-xs rounded whitespace-nowrap pointer-events-none">
                    {val}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
