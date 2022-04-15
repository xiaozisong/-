export function addData (arr) {
  const directionList = arr.map(item => item.direction)

  const difficultyList = arr.map(item => item.difficulty)
  const questionType = arr.map(item => item.questionType)
  return {
    directionList,
    difficultyList,
    questionType
  }
}
