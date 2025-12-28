import { useThemeColor } from "@/hooks/useThemeColor";
import React, { memo, useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Path, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from "react-native-reanimated";

const AnimatedG = Animated.createAnimatedComponent(G);

// Simple SVG paths for math symbols
const SYMBOLS = [
  // Plus +
  { path: "M20 40 L60 40 M40 20 L40 60", viewBox: "0 0 80 80" },
  // Minus -
  { path: "M20 40 L60 40", viewBox: "0 0 80 80" },
  // Multiply ×
  { path: "M25 25 L55 55 M55 25 L25 55", viewBox: "0 0 80 80" },
  // Divide ÷
  {
    path: "M20 40 L60 40",
    viewBox: "0 0 80 80",
    circleProps: [
      { cx: 40, cy: 20, r: 4 },
      { cx: 40, cy: 60, r: 4 },
    ],
  },
  // Equals =
  { path: "M20 32 L60 32 M20 48 L60 48", viewBox: "0 0 80 80" },
  // Percent %
  {
    path: "M55 20 L25 60",
    viewBox: "0 0 80 80",
    circleProps: [
      { cx: 28, cy: 28, r: 6 },
      { cx: 52, cy: 52, r: 6 },
    ],
  },
  // Pi π
  // { path: "M20 25 L60 25 M30 25 L30 60 M50 25 L50 60", viewBox: "0 0 80 80" },
  // Square root √
  { path: "M15 45 L25 55 L40 20 L60 20", viewBox: "0 0 80 80" },
  // Infinity ∞
  // { path: "M20 40 C20 25 35 25 40 40 C45 55 60 55 60 40 C60 25 45 25 40 40 C35 55 20 55 20 40", viewBox: "0 0 80 80" },
  // Sigma Σ (sum)
  // { path: "M55 20 L25 20 L40 40 L25 60 L55 60", viewBox: "0 0 80 80" },
  // Delta Δ
  { path: "M40 15 L20 65 L60 65 Z", viewBox: "0 0 80 80" },
  // Approximately ≈
  { path: "M20 32 Q30 25 40 32 Q50 39 60 32 M20 48 Q30 41 40 48 Q50 55 60 48", viewBox: "0 0 80 80" },
  // Less than <
  { path: "M55 20 L25 40 L55 60", viewBox: "0 0 80 80" },
  // Greater than >
  { path: "M25 20 L55 40 L25 60", viewBox: "0 0 80 80" },
  // Number sign #
  { path: "M30 15 L25 65 M50 15 L45 65 M18 30 L62 30 M15 50 L60 50", viewBox: "0 0 80 80" },
];

const NUMBER_OF_ELEMENTS = 28;
const MIN_SYMBOL_DISTANCE = 60; // Minimum distance between symbols
const SYMBOL_SIZE = 80; // Size of each symbol (matches viewBox)
const MIN_SCALE = 0.4;
const MAX_SCALE = 0.9;

// Seeded random number generator for consistent positions
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate random positions across the screen with good distribution
// Symbols can extend beyond screen edges (get cut off) for a more natural look
const getRandomPositions = (count: number, width: number, height: number) => {
  // Allow symbols to be placed partially outside the screen
  const overflow = SYMBOL_SIZE * MAX_SCALE * 0.3; // 30% of symbol can be off-screen
  const usableWidth = width + 2 * overflow;
  const usableHeight = height + 2 * overflow;
  const startX = -overflow;
  const startY = -overflow;
  const positions: { x: number; y: number }[] = [];

  // Use a seed based on screen dimensions for consistent layout
  let seed = Math.floor(width * height) % 1000;

  // Create a grid-based distribution with random offset for natural look
  const cols = Math.ceil(Math.sqrt(count * (usableWidth / usableHeight)));
  const rows = Math.ceil(count / cols);
  const cellW = usableWidth / cols;
  const cellH = usableHeight / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (positions.length >= count) break;

      seed++;
      const offsetX = (seededRandom(seed) - 0.5) * cellW * 0.7;
      seed++;
      const offsetY = (seededRandom(seed + 0.3) - 0.5) * cellH * 0.7;

      const x = startX + (col + 0.5) * cellW + offsetX;
      const y = startY + (row + 0.5) * cellH + offsetY;

      positions.push({ x, y });
    }
  }

  // Shuffle positions for more random symbol assignment
  for (let i = positions.length - 1; i > 0; i--) {
    seed++;
    const j = Math.floor(seededRandom(seed) * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
};

const AnimatedSymbol = ({
  index,
  position,
  color,
}: {
  index: number;
  position: { x: number; y: number };
  color: string;
}) => {
  const symbol = SYMBOLS[index % SYMBOLS.length];
  const { x, y } = position;
  // Scale varies from MIN_SCALE to MIN_SCALE + 0.4 (e.g., 0.5 to 0.9)
  const scale = MIN_SCALE + ((index * 7) % 5) / 10;
  const rotation = (index * 45) % 360;

  // Offset to center the symbol (since paths are drawn within 0-80 viewBox)
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

  // Simulate glow by rendering a thicker, more transparent stroke behind the main symbol
  const transformString = `translate(${centeredX}, ${centeredY}) translate(${SYMBOL_SIZE / 2}, ${SYMBOL_SIZE / 2}) rotate(${rotation}) scale(${scale}) translate(${-SYMBOL_SIZE / 2}, ${-SYMBOL_SIZE / 2})`;

  return (
    <AnimatedG transform={transformString} animatedProps={animatedProps}>
      {/* Glow layer (simulated by thick, transparent stroke) */}
      <Path d={symbol.path} stroke={glowColor} strokeWidth="16" strokeLinecap="round" fill="none" />
      {symbol.circleProps?.map((cp, i) => (
        <Circle key={i} {...cp} fill={glowColor} />
      ))}
      {/* Main symbol */}
      <Path d={symbol.path} stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
      {symbol.circleProps?.map((cp, i) => (
        <Circle key={i} {...cp} fill={color} />
      ))}
    </AnimatedG>
  );
};

export const BackgroundPattern = memo(() => {
  const { width, height } = useWindowDimensions();
  // Low opacity color from theme, but we want it to blend
  // Using a white or very light color for dark mode, dark for light mode
  const patternColor = useThemeColor({ light: "#6366f1", dark: "#a5b4fc" }, "text");

  // Generate random positions for all symbols with even distribution
  const positions = useMemo(() => getRandomPositions(NUMBER_OF_ELEMENTS, width, height), [width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height="100%" width="100%">
        {positions.map((pos, i) => (
          <AnimatedSymbol key={i} index={i} position={pos} color={patternColor} />
        ))}
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});
