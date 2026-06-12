import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsBar } from "./stats-bar";

const score = {
  total: 50,
  answered: 3,
  correct: 2,
  wrong: 1,
  percent: 4
};

describe("StatsBar", () => {
  it("hides correct and wrong counts during an unfinished exam", () => {
    render(<StatsBar mode="exam" score={score} current={3} timerText="49:11" showScore={false} />);

    expect(screen.getByText("Đã chọn 3")).toBeInTheDocument();
    expect(screen.queryByText("Đúng 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Sai 1")).not.toBeInTheDocument();
  });

  it("shows correct and wrong counts when feedback is allowed", () => {
    render(<StatsBar mode="practice" score={score} current={3} timerText="00:42" showScore />);

    expect(screen.getByText("Đúng 2")).toBeInTheDocument();
    expect(screen.getByText("Sai 1")).toBeInTheDocument();
  });
});
