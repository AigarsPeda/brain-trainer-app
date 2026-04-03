import { CreateMathTask } from "@/components/mathTasks/CreateMathTask";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import { TaskSession } from "@/components/mathTasks/taskSession";
import { TextTask } from "@/components/mathTasks/TextTask";
import { TaskType, isCreateMathTask, isMultiAnswerMathTask, isTextTask } from "@/context/app.context.reducer";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

type GameLevelTaskStageProps = {
  currentTask: TaskType;
  getLevelCompletionDurationMs: () => number;
  isBossLevel: boolean;
  isFinalTaskInLevel: boolean;
  level: string;
  maxLevelStep: number;
  removedAnswerIds: number[];
  showTextTaskAsMultipleChoice: boolean;
  taskSession: TaskSession;
  taskKey: string;
};

export function GameLevelTaskStage({
  currentTask,
  getLevelCompletionDurationMs,
  isBossLevel,
  isFinalTaskInLevel,
  level,
  maxLevelStep,
  removedAnswerIds,
  showTextTaskAsMultipleChoice,
  taskSession,
  taskKey,
}: GameLevelTaskStageProps) {
  const hasRenderedInitialTaskRef = useRef(false);

  useEffect(() => {
    hasRenderedInitialTaskRef.current = true;
  }, []);

  const enteringTaskAnimation = hasRenderedInitialTaskRef.current
    ? SlideInRight.duration(250).withInitialValues({ transform: [{ translateX: 250 }] })
    : undefined;

  const sharedTaskSession = useMemo(
    () => ({
      ...taskSession,
      getLevelCompletionDurationMs,
      isBossLevel,
    }),
    [getLevelCompletionDurationMs, isBossLevel, taskSession]
  );

  return (
    <View style={styles.levelView}>
      <Animated.View
        key={taskKey}
        style={styles.taskContainer}
        entering={enteringTaskAnimation}
        exiting={SlideOutLeft.duration(200).withInitialValues({
          transform: [{ translateX: 0 }],
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        })}
      >
        {isMultiAnswerMathTask(currentTask) && (
          <MathTaskWithResult
            level={level}
            task={currentTask}
            maxLevelStep={maxLevelStep}
            removedAnswerIds={removedAnswerIds}
            isFinalTaskInLevel={isFinalTaskInLevel}
            session={sharedTaskSession}
          />
        )}
        {isCreateMathTask(currentTask) && (
          <CreateMathTask
            level={level}
            task={currentTask}
            maxLevelStep={maxLevelStep}
            removedAnswerIds={removedAnswerIds}
            isFinalTaskInLevel={isFinalTaskInLevel}
            session={sharedTaskSession}
          />
        )}
        {isTextTask(currentTask) && (
          <TextTask
            level={level}
            task={currentTask}
            maxLevelStep={maxLevelStep}
            removedAnswerIds={removedAnswerIds}
            isFinalTaskInLevel={isFinalTaskInLevel}
            showAsMultipleChoice={showTextTaskAsMultipleChoice}
            session={sharedTaskSession}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  levelView: {
    flex: 1,
    paddingTop: 10,
  },
  taskContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
