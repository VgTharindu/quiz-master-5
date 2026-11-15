// attempt එකක ලකුණු: එම පරීක්ෂණයේ ප්‍රශ්න අතරින් නිවැරදි පිළිතුරු දුන් ප්‍රශ්නවල ලකුණු එකතුව
export const calcScore = (attempt, questions) =>
  questions
    .filter(
      (q) =>
        q.test_id === attempt.test_id &&
        attempt.answers?.[q.id]?.a === q.correct,
    )
    .reduce((sum, q) => sum + q.marks, 0);
