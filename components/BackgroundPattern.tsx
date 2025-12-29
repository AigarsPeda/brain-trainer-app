import { useThemeColor } from "@/hooks/useThemeColor";
import { memo, useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Path } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

const SYMBOLS = [
  // Plus +
  { path: "M20 40 L60 40 M40 20 L40 60" },
  // Minus -
  { path: "M20 40 L60 40" },
  // Multiply ×
  { path: "M25 25 L55 55 M55 25 L25 55" },
  // Divide ÷
  {
    path: "M20 40 L60 40",
    circleProps: [
      { cx: 40, cy: 22, r: 4 },
      { cx: 40, cy: 58, r: 4 },
    ],
  },
  // Equals =
  { path: "M20 32 L60 32 M20 48 L60 48" },
  // Percent %
  {
    path: "M55 20 L25 60",
    circleProps: [
      { cx: 30, cy: 28, r: 5 },
      { cx: 50, cy: 52, r: 5 },
    ],
  },
  // Square root √
  { path: "M18 45 L28 55 L42 22 L60 22" },
  // Delta Δ
  { path: "M40 18 L22 62 L58 62 Z" },
  // Approximately ≈
  { path: "M20 32 Q30 25 40 32 Q50 39 60 32 M20 48 Q30 41 40 48 Q50 55 60 48" },
  // Less than <
  { path: "M55 22 L25 40 L55 58" },
  // Greater than >
  { path: "M25 22 L55 40 L25 58" },
  // Number sign #
  { path: "M32 18 L28 62 M48 18 L44 62 M20 32 L60 32 M20 48 L60 48" },
];

const MIN_SCALE = 0.4;
const MAX_SCALE = 0.9;
const SYMBOL_SIZE = 80; // Size of each symbol (matches viewBox)
const MIN_DISTANCE = 85; // Minimum distance between symbol centers
const MAX_ATTEMPTS = 30; // Attempts per point in Poisson disk sampling

// Seeded random number generator for consistent positions
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Random float between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Random integer between min (inclusive) and max (exclusive)
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max));
  }
}

// Poisson disk sampling for even distribution with randomness
const poissonDiskSampling = (
  width: number,
  height: number,
  minDist: number,
  rng: SeededRandom
): { x: number; y: number }[] => {
  const cellSize = minDist / Math.SQRT2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid: (number | null)[][] = Array.from({ length: gridWidth }, () => Array(gridHeight).fill(null));

  const activeList: number[] = [];
  const points: { x: number; y: number }[] = [];

  const getGridCell = (x: number, y: number): [number, number] => {
    return [Math.floor(x / cellSize), Math.floor(y / cellSize)];
  };

  // Check if a point is valid (far enough from all neighbors)
  const isValidPoint = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;

    const [cellX, cellY] = getGridCell(x, y);

    // Check neighboring cells (5x5 grid around the point)
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const nx = cellX + dx;
        const ny = cellY + dy;

        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
          const pointIndex = grid[nx][ny];
          if (pointIndex !== null) {
            const neighbor = points[pointIndex];
            const distSq = (x - neighbor.x) ** 2 + (y - neighbor.y) ** 2;
            if (distSq < minDist * minDist) return false;
          }
        }
      }
    }
    return true;
  };

  const addPoint = (x: number, y: number): void => {
    const index = points.length;
    points.push({ x, y });
    activeList.push(index);
    const [cellX, cellY] = getGridCell(x, y);
    if (cellX >= 0 && cellX < gridWidth && cellY >= 0 && cellY < gridHeight) {
      grid[cellX][cellY] = index;
    }
  };

  addPoint(rng.range(0, width), rng.range(0, height));

  while (activeList.length > 0) {
    const activeIndex = rng.int(0, activeList.length);
    const point = points[activeList[activeIndex]];

    let found = false;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const angle = rng.range(0, 2 * Math.PI);
      const distance = rng.range(minDist, minDist * 2);
      const newX = point.x + Math.cos(angle) * distance;
      const newY = point.y + Math.sin(angle) * distance;

      if (isValidPoint(newX, newY)) {
        addPoint(newX, newY);
        found = true;
        break;
      }
    }

    if (!found) {
      // Remove from active list if no valid points found
      activeList.splice(activeIndex, 1);
    }
  }

  return points;
};

const getRandomPositions = (width: number, height: number) => {
  // Add overflow to cover edges
  const overflow = SYMBOL_SIZE * MAX_SCALE * 0.5;
  const totalWidth = width + 2 * overflow;
  const totalHeight = height + 2 * overflow;

  const seed = Math.floor((width * 17 + height * 31) % 10000);
  const rng = new SeededRandom(seed);

  const rawPositions = poissonDiskSampling(totalWidth, totalHeight, MIN_DISTANCE, rng);

  // Offset positions to account for overflow
  const positions = rawPositions.map((pos) => ({
    x: pos.x - overflow,
    y: pos.y - overflow,
  }));

  // Shuffle for random symbol assignment
  for (let i = positions.length - 1; i > 0; i--) {
    const j = rng.int(0, i + 1);
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
};

const AnimatedSymbol = ({
  color,
  index,
  rngSeed,
  position,
}: {
  index: number;
  color: string;
  rngSeed: number;
  position: { x: number; y: number };
}) => {
  const symbol = SYMBOLS[index % SYMBOLS.length];
  const { x, y } = position;

  // Use seeded random for consistent scale/rotation per symbol
  const rng = new SeededRandom(rngSeed + index * 137);
  const scale = rng.range(MIN_SCALE, MAX_SCALE);
  const rotation = rng.range(0, 360);

  const centerOffset = (SYMBOL_SIZE * scale) / 2;
  const centeredX = x - centerOffset;
  const centeredY = y - centerOffset;

  // Color variation for glow
  const glowColor = color + "33"; // Add alpha for glow (e.g. #a5b4fc33)

  const opacity = useSharedValue(0.1 + ((index * 3) % 10) / 100);

  useEffect(() => {
    opacity.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(0.3, { duration: 2000 + index * 100, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.1, { duration: 2000 + index * 100, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      opacity: opacity.value,
    };
  });

  const transformString = `translate(${centeredX}, ${centeredY}) translate(${SYMBOL_SIZE / 2}, ${SYMBOL_SIZE / 2}) rotate(${rotation}) scale(${scale}) translate(${-SYMBOL_SIZE / 2}, ${-SYMBOL_SIZE / 2})`;

  return (
    <AnimatedG transform={transformString} animatedProps={animatedProps}>
      <Path d={symbol.path} stroke={glowColor} strokeWidth="16" strokeLinecap="round" fill="none" />
      {symbol.circleProps?.map((cp, i) => (
        <Circle key={i} {...cp} fill={glowColor} />
      ))}
      <Path d={symbol.path} stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
      {symbol.circleProps?.map((cp, i) => (
        <Circle key={i} {...cp} fill={color} />
      ))}
    </AnimatedG>
  );
};

export const BackgroundPattern = memo(() => {
  const { width, height } = useWindowDimensions();
  const positions = useMemo(() => getRandomPositions(width, height), [width, height]);
  const patternColor = useThemeColor({ light: "#6366f1", dark: "#a5b4fc" }, "text");
  const rngSeed = useMemo(() => Math.floor((width * 17 + height * 31) % 10000), [width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height="100%" width="100%">
        {positions.map((pos, i) => (
          <AnimatedSymbol key={i} index={i} position={pos} color={patternColor} rngSeed={rngSeed} />
        ))}
      </Svg>
    </View>
  );
});
