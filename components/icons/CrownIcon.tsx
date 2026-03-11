import Svg, { Path, SvgProps } from "react-native-svg";

const CrownIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill={props.fill ?? "none"} {...props}>
    <Path
      d="M4 18.5 5.7 7.8c.1-.6.8-.9 1.3-.5l3.8 3.2c.4.3 1 .2 1.2-.3l2-4.4c.3-.6 1.1-.6 1.4 0l2 4.4c.2.5.8.6 1.2.3l3.8-3.2c.5-.4 1.2-.1 1.3.5L20 18.5c-.1.8-.8 1.5-1.6 1.5H5.6c-.8 0-1.5-.7-1.6-1.5Z"
      stroke={props.stroke ?? "#fff"}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path d="M8 14h8" stroke={props.stroke ?? "#fff"} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);

export default CrownIcon;
