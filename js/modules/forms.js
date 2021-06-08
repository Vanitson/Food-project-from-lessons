import {closeModal, openModal} from './modal';
import {postData} from '../services/services';


function forms(formSelector, modalTimerId) {
    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: '../img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {   //подвязываем к формам функцию postData
        bindPostData(item);
    });



    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText =
             `display:block;
             margin: 0 auto;`;
            form.insertAdjacentElement('afterend', statusMessage); //вставляем спиннер после формы, чтобы не сжимать элементы



            // request.setRequestHeader(); // обязательно устанавливаем заголовок запроса

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));


            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

            // request.send(json); // отправка данных


        });
        
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }




    //  Promise


    // console.log('Запрос данных...');


    // const testFunction = new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         console.log('Подготовка данных...');

    //         const product = {
    //             name: 'TV',
    //             price: 2000
    //         };
            

    //         resolve(product);

    //     }, 2000);
    // });


    // testFunction.then((product) => {
    //     setTimeout(() => {
    //         product.status = 'order';
    //         console.log(product);
    //     }, 2000);
    // });


    fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));
}
export default forms;