const inputs = document.querySelectorAll('input[type=number]');
const btn = document.querySelector('.btn');
const items = document.querySelector('.items');
const randomNumberOfDigits = 3;
const randomNumberArr = [];
const inputValueArr = [];
const gameInfo = {
  count: 10,
  duplicationResult: false,
  result : {
    strike: 0,
    ball: 0,
    out: 0,
  }
};

function resetArray(array) {
  array.splice(0);
}

function resetGame() {
  gameInfo.duplicationResult = false;
  gameInfo.count = 10;
  inputs.forEach((input) => {
    input.value = '';
  });
  items.innerHTML = '';
  gameInfo.result = {
    strike: 0,
    ball: 0,
    out: 0,
  };
  resetArray(inputValueArr);
  resetArray(randomNumberArr);
  randomNumber(randomNumberArr, randomNumberOfDigits);
}

function randomNumber(array, num) {
  for (let i = 0; i < num; i++) {
    const newNumber = Math.floor(Math.random() * 10);
    array.indexOf(newNumber) > -1 ? i-- : array.push(newNumber);
  }
}

function duplicationCheck(array) {
  const setArray = new Set(array);
  setArray.size !== array.length ? (gameInfo.duplicationResult = true) : (gameInfo.duplicationResult = false);
  return gameInfo.duplicationResult;
}

function matchArr(array1, array2) {
  array2.forEach((value) => {
    if (array1.indexOf(value) > -1) {
      if (array2[array1.indexOf(value)] === array1[array1.indexOf(value)]) {
        gameInfo.result.strike++;
      } else {
        gameInfo.result.ball++;
      }
    } else {
      gameInfo.result.out++;
    }
  });
}

function creatItem(value, result) {
  const item = document.createElement('li');
  item.innerHTML = `
    <li class="item">
      <div class="number">${value}</div>
      <div class="result">${result}</div>
    </li>
  `;
  return items.append(item);
}

randomNumber(randomNumberArr, randomNumberOfDigits);

inputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (input.value.length) input.value = input.value.slice(0, input.maxLength);
  });
});

btn.addEventListener('click', () => {
  if (!gameInfo.count) {
    const confirmCheck = confirm('기회를 모두 소진하였습니다. \n재시작하시겠습니까?');
    if (confirmCheck) return resetGame();
    return false;
  }

  resetArray(inputValueArr);
  inputs.forEach((input) => {
    inputValueArr.push(input.value === '' ? input.value : Number(input.value));
  });

  if (inputValueArr.indexOf('') > -1) return alert('숫자를 채워주세요');

  duplicationCheck(inputValueArr);
  if (gameInfo.duplicationResult) return alert('중복된 숫자를 제거해주세요');

  gameInfo.result = {
    strike: 0,
    ball: 0,
    out: 0,
  };
  matchArr(randomNumberArr, inputValueArr);

  creatItem(inputValueArr, `${gameInfo.result.strike} STRIKE / ${gameInfo.result.ball} BALL / ${gameInfo.result.out} OUT`);
  gameInfo.count--;

  if (gameInfo.result.strike === randomNumberOfDigits) {
    alert('모든 숫자를 맞히는데 성공했어요!');
    resetGame();
  }
});
