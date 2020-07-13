// Объект с сохраненными ответами 
var answers = {
    2: null,
    3: null,
    4: null,
    5: null
}

// Клик вперед
var btnNext = document.querySelectorAll('[data-nav="next"]')
btnNext.forEach(function(item){
    item.addEventListener('click', function(){
        var thisCard = this.closest('[data-card]')
        var thisCardNumber = parseInt(thisCard.dataset.card)
        // Проверка на ввод данных
        if (thisCard.dataset.validate == 'novalidate') {
            navigate('next', thisCard)
            updateProgressBar('next', thisCardNumber)
        } else {
            // Сохранение собранных данных в объект
            saveAnswer(thisCardNumber, gatherCardDate(thisCardNumber))
            // Проверка на заполненость
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)){
                navigate('next', thisCard)
                updateProgressBar('next', thisCardNumber)
            } else if (!checkOnRequired(thisCardNumber)) {
                alert('Введите Ваш email и примите соглашение с политикой конфеденциальности.')
                throw new Error('Script stopped. Поле checkbox и email не прошли валидацию.')
            } else {
                alert('Выберете ответ, прежде чем переходить далее.')
            }
        }
    })
})
// Клик назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]')
btnPrev.forEach(function(item){
    item.addEventListener('click', function(){
        var thisCard = this.closest('[data-card]')
        var thisCardNumber = parseInt(thisCard.dataset.card)

        navigate('prev', thisCard)
        updateProgressBar('prev', thisCardNumber)
    })
})

//Функция навигации назад, вперед
function navigate(direction, thisCard){
    var thisCardNumber = parseInt(thisCard.dataset.card)
    var nextCard

    if (direction == 'next') {
        nextCard = thisCardNumber + 1
    } else if (direction == 'prev') {
        nextCard = thisCardNumber - 1
    }

    thisCard.classList.add('hidden')
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden')
}

// Функция сбора данных
function gatherCardDate(number){
    var question
    var result = []
    // Находим текущую карточку по номеру и data-атрибуту
    var currentCard = document.querySelector(`[data-card="${number}"]`)
    // Находим вопрос карточки    
    question = currentCard.querySelector('[data-question]').innerText

    // сбора данных по чекбоксам и радио кнопкам
    var checkBoxRadioValues = currentCard.querySelectorAll('[type="checkbox"], [type="radio"]')
    checkBoxRadioValues.forEach(function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    // сбора данных из инпутов
    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]')
    inputValues.forEach(function(item){
        itemValue = item.value
        if (itemValue.trim() != "") {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    var data = {
        question: question,
        answer: result
    }

    return data
}

// Функция записи собранных данных
function saveAnswer(number, data){
    answers[number] = data
}

// Функция проверки на заполненость
function isFilled(number){
    return answers[number].answer.length > 0
}

// Функция для проверки email
function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i
    return pattern.test(email)
}

// Функция проверки на заполненость обязательных чекбоксов и инпутов email
function checkOnRequired(number){
    // Находим текущую карточку по номеру и data-атрибуту
    var currentCard = document.querySelector(`[data-card="${number}"]`)
    // Находим все элементы с атрибутом 'required'
    var requiredFields = currentCard.querySelectorAll('[required]')
    var isValidArray = []
    
    requiredFields.forEach(function(item){
        if (item.type == 'checkbox' && !item.checked) {
            isValidArray.push(false)
            alert('Необходимо принять соглашение с политикой конфеденциальности.')
            throw new Error('Script stopped. Поле checkbox не прошло валидацию.')
        } else if (item.type == 'email' && !validateEmail(item.value)) {
            isValidArray.push(false)
            alert('Некорректный email.')
            throw new Error('Script stopped. Поле email не прошло валидацию.')
        } 
    })

    return !isValidArray.includes(false)
}

// Подсветка рамки для радио
document.querySelectorAll('.radio-group').forEach(function(item){
    item.addEventListener('click', function(e){
        // Проверяем где проишел клик, внутри тега label или нет
        var label = e.target.closest('label')
        if (label) {
            // Если кликнули на label отменяем активный класс у всех тегов label
            label.closest('.radio-group').querySelectorAll('label').forEach(function(item){
                item.classList.remove('radio-block--active')
            })
            // Добавляем активный класс к тому label по которому кликнули
            label.classList.add('radio-block--active')
        }
    })
})
// Подсветка рамки для чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
    item.addEventListener('change', function(){
        // Если чекбокс выбран то
        if (item.checked) {
            // Добавляем активный класс к label
            item.closest('label').classList.add('checkbox-block--active')
        } else {
            // Убираем активный класс у label
            item.closest('label').classList.remove('checkbox-block--active')
        }
    })
})

// Прогресс-бар
function updateProgressBar(direction,cardNumber){
    // Расчитать сколько всего карточек
    cardsTotalNumber = document.querySelectorAll('[data-card]').length
    // Определяем текущую карточку
    // Определяем направления движения
    if (direction == 'next') {
        cardNumber = cardNumber + 1
    } else if (direction == 'prev') {
        cardNumber = cardNumber - 1
    }
    // Расчет процентов прохождения
    var progress = ((cardNumber * 100) / cardsTotalNumber).toFixed()
    // Обновляем прогресс-бар
    // Делаем проверку есть ли прогресс бар на карточки
    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress')

    if (progressBar) {
        // Находим div содержащий проценты прогресса внутри карточки и обновляем его
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`
        // Так же обновляем линию прогресс бара
        progressBar.querySelector('.progress__line-bar').style = `width: ${progress}%`
    }
}
