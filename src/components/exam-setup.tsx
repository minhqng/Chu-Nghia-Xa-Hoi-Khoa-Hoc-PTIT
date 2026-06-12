import { Play } from "lucide-react";

interface ExamSetupProps {
  totalQuestions: number;
  count: number;
  onCountChange: (count: number) => void;
  onStart: () => void;
}

function buildCountOptions(total: number): number[] {
  const options: number[] = [];
  for (let count = 50; count < total; count += 50) options.push(count);
  if (!options.includes(total)) options.push(total);
  return options;
}

export function ExamSetup({ totalQuestions, count, onCountChange, onStart }: ExamSetupProps) {
  const options = buildCountOptions(totalQuestions);

  return (
    <section className="exam-setup">
      <div>
        <p className="eyebrow">Thi thử ngẫu nhiên</p>
        <h2>Bốc câu từ cả 2 thư mục lớn</h2>
        <p>
          Đề thi không hiện đáp án khi làm. Sau khi nộp bài, bạn xem điểm,
          câu sai và đáp án đúng để rà lại keyword.
        </p>
      </div>
      <label htmlFor="exam-count">Số câu</label>
      <select id="exam-count" value={count} onChange={(event) => onCountChange(Number(event.target.value))}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === totalQuestions ? `Tất cả ${option} câu` : `${option} câu - ${option} phút`}
          </option>
        ))}
      </select>
      <button className="primary-action" onClick={onStart}>
        <Play size={18} />
        Bắt đầu thi thử
      </button>
    </section>
  );
}
