const inputs = document.querySelectorAll('input[type=number]');
const btn = document.querySelector('.input .btn-primary');
const items = document.querySelector('.items');
const randomNumberOfDigits = 3;
const randomNumberArr = [];
const inputValueArr = [];
const popupInfo = {
  explain: {
    title: '게임 설명',
    desc: '랜덤으로 생성된 3자리 숫자를 맞춰보세요.\n중복된 숫자는 없어요.\n숫자가 일치하지 않으면 OUT,\n숫자는 일치하지만 자리는 일치하지 않으면 BALL,\n숫자와 자리가 일치하면 STRIKE 예요.\n단서를 보고 숫자를 맞춰나가보세요.\n기회는 총 10번이예요!',
    result : false,
  },
  restart: {
    desc: '기회를 모두 소진했어요.\n재시작할까요?',
    result : false,
  },
  filledNumbers: {
    desc: '숫자를 채워주세요',
    result : false,
  },
  duplicateNumbers: {
    desc: '중복된 숫자를 제거해주세요',
    result : false,
  },
  success: {
    desc: '모든 숫자를 맞히는데 성공했어요!\n재시작할까요?',
    result : false,
  }
}
const gameInfo = {
  count: 10,
  duplicationResult: false,
  result: {
    strike: 0,
    ball: 0,
    out: 0,
  },
};

function resetArray(array) {
  array.splice(0);
}

function resetGame() {
  gameInfo.duplicationResult = false;
  gameInfo.count = 10;
  inputs.forEach((input) => {
    input.value = '';
    input.disabled = false;
  });
  items.innerHTML = '';
  gameInfo.result = {
    strike: 0,
    ball: 0,
    out: 0,
  };
  btn.textContent = '확인';
  resetArray(inputValueArr);
  resetArray(randomNumberArr);
  randomNumber(randomNumberArr, randomNumberOfDigits);
  inputs[0].focus();
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

function popupButtonsClick(e, popupInfo) {
  if(e.target.classList.contains('popup-contents')) return e.currentTarget.remove();
  if(e.target.tagName !== 'BUTTON') return;
  e.currentTarget.remove();
  e.target.dataset.type === 'cancel' ? popupInfo.result = false : popupInfo.result = true;
  if (popupInfo.result) return resetGame();
}

function creatItem(value, result) {
  const item = document.createElement('li');
  item.classList.add('item');
  item.innerHTML = `
    <div class="number">${value}</div>
    <div class="result">${result}</div>
  `;
  return items.append(item);
}

function createPopup(popupType, popupInfo) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.setAttribute('data-type', popupType);
  popup.innerHTML = `
  <div class="popup-contents">
    <div class="popup-inner">
      ${popupInfo.title ? '<header class="popup-header"><h2 class="title">' + popupInfo.title + '</h2></header>' : ''}
      <div class="popup-main">${popupInfo.desc}</div>
      <footer class="popup-footer">
        ${popupType === 'confirm' ? '<button type="button" class="btn-secondary" data-type="cancel">취소</button>' : ''}
        <button type="button" class="btn-primary" data-type="${popupType === 'confirm' ? 'confirm' : 'cancel'}">확인</button>
      </footer>
    </div>
  </div>
  `;
  document.querySelector('body').append(popup);
  popup.addEventListener('click', (e) => popupButtonsClick(e, popupInfo));
}

createPopup('alert', popupInfo.explain);
randomNumber(randomNumberArr, randomNumberOfDigits);
inputs[0].focus();

inputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (input.value.length) input.value = input.value.slice(0, input.maxLength);
  });
});

btn.addEventListener('click', () => {
  if(items.querySelector('li') && items.querySelector('li:last-child .result').textContent === `${randomNumberOfDigits} HOMERUN`) return createPopup('confirm',  popupInfo.success);
  
  if (!gameInfo.count) return createPopup('confirm', popupInfo.restart);

  resetArray(inputValueArr);
  inputs.forEach((input) => {
    inputValueArr.push(input.value === '' ? input.value : Number(input.value));
  });

  if (inputValueArr.indexOf('') > -1) {
    createPopup('alert', popupInfo.filledNumbers);
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].value) return inputs[i].focus();
    }
    return;
  }

  duplicationCheck(inputValueArr);
  if (gameInfo.duplicationResult) {
    createPopup('alert',  popupInfo.duplicateNumbers);
    inputs[0].focus();
    return;
  }

  gameInfo.result = {
    strike: 0,
    ball: 0,
    out: 0,
  };
  matchArr(randomNumberArr, inputValueArr);

  if (gameInfo.result.strike === randomNumberOfDigits) {
    if(items.querySelector('li:last-child .result').textContent != `${randomNumberOfDigits} HOMERUN`) {
      creatItem(inputValueArr, `${randomNumberOfDigits} HOMERUN`);
    }
    createPopup('confirm',  popupInfo.success);
    inputs.forEach((input) => {
      input.disabled = true;
    });
    btn.textContent = '재시작';
    return;
  }

  creatItem(inputValueArr, `${gameInfo.result.strike} STRIKE / ${gameInfo.result.ball} BALL / ${gameInfo.result.out} OUT`);
  gameInfo.count--;

  inputs.forEach((input) => {
    input.value = '';
  });
  inputs[0].focus();
});
