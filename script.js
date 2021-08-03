const LOGIN_KEY = 'login';
const PASSWORD_KEY = 'password';
const REMEMBER_KEY = 'remember';
const PAGE_TABS = {
	films: 'films-tab',
	genre: 'genre-tab'
};
const SELECTORS = {
	showPopupBtn: '.header-enter__button',
	popup: '.popup',
	popupOverlay: '.popup__overlay',
	tabsItem: '.tabs__item',
	rememberCheckbox: '.controls__remember-checkbox',
	loginInput: '.controls__login',
	passwordInput: '.controls__password',
	enterFormBtn: '.form__enter-button',
	enteredHeader: '.header__entered-user',
	defaultHeader: '.header__header-enter',
	userInfoText: '.header__user-info-text',
	userInfoInput: '.header__user-info-input',
	userInfoLogoutBtn: '.header__user-info-logout',
	tvChannelsContainer: '.tv-channels__tv-channel',
}
const PAGE_TABS_CLASSES = {
	[PAGE_TABS.films]: 'films-wrapper',
	[PAGE_TABS.genre]: 'tv-series-wrapper'
};
const FORM_KEYS = [LOGIN_KEY, PASSWORD_KEY, REMEMBER_KEY];
const HIDE_CLASS = 'hide';
const ACTIVE_TAB_CLASS = 'active-tab';
let currentSelectedTab = PAGE_TABS.films;
let isEntered = false;

// POPUP
const showPopupBtn = document.querySelector(SELECTORS.showPopupBtn);
const popup = document.querySelector(SELECTORS.popup);
const popupOverlay = document.querySelector(SELECTORS.popupOverlay);

// TABS
const tabsItems = document.querySelectorAll(SELECTORS.tabsItem);

// POPUP FORM
const rememberCheckbox = document.querySelector(SELECTORS.rememberCheckbox);
const loginInput = document.querySelector(SELECTORS.loginInput);
const passwordInput = document.querySelector(SELECTORS.passwordInput);
const enterFormBtn = document.querySelector(SELECTORS.enterFormBtn);

// HEADER USER INFO
const enteredHeader = document.querySelector(SELECTORS.enteredHeader);
const defaultHeader = document.querySelector(SELECTORS.defaultHeader);
const userInfoText = document.querySelector(SELECTORS.userInfoText);
const userInfoInput = document.querySelector(SELECTORS.userInfoInput);
const userInfoLogoutBtn = document.querySelector(SELECTORS.userInfoLogoutBtn);


const initialTabContent = document.querySelector(`.${PAGE_TABS_CLASSES[currentSelectedTab]}`);
initialTabContent?.setAttribute('style', 'display: block;');

const getTvScrollContainer = () => {
	return document.querySelector(SELECTORS.tvChannelsContainer);
};

const updateScrollbar = () => {
	SimpleScrollbar.initEl(getTvScrollContainer());
};

const setInLocalStorage = (key, value) => {
	window.localStorage.setItem(key, value);
};

const getFromLocalStorage = (key) => {
	return window.localStorage.getItem(key);
};

const showPopup = () => {
	popup.classList.remove(HIDE_CLASS);
};

const hidePopup = () => {
	popup.classList.add(HIDE_CLASS);
};

const updateUserInfoText = (value) => {
	userInfoText.textContent = value;
}

const showLoggedInUser = () => {
	defaultHeader.setAttribute('style', 'display: none;');
	enteredHeader.setAttribute('style', 'display: flex;');
}

const showDefaultHeader = () => {
	enteredHeader.setAttribute('style', 'display: none;');
	defaultHeader.setAttribute('style', 'display: flex;');
}

const loginLsValue = getFromLocalStorage(LOGIN_KEY);
const passwordLsValue = getFromLocalStorage(PASSWORD_KEY);

if (!!loginLsValue && !!passwordLsValue) {
	isEntered = true;

	updateUserInfoText(loginLsValue);
	showLoggedInUser();
} else {
	showDefaultHeader();
}

tabsItems.forEach((tabNode) => {
	tabNode.addEventListener('click', () => {
		setActiveTab(tabNode);
	})
});

const setActiveTab = (tabNode) => {
	let tabContent;

	tabsItems.forEach((tabItem) => {
		tabItem.classList.remove(ACTIVE_TAB_CLASS);
	});

	tabNode.classList.add(ACTIVE_TAB_CLASS);
	tabContent = document.querySelector(`.${PAGE_TABS_CLASSES[currentSelectedTab]}`);
	tabContent?.setAttribute('style', 'display: none;');
	currentSelectedTab = tabNode.classList.contains(PAGE_TABS.films)
		? PAGE_TABS.films
		: PAGE_TABS.genre;
	tabContent = document.querySelector(`.${PAGE_TABS_CLASSES[currentSelectedTab]}`);
	
	if (currentSelectedTab === PAGE_TABS.films) {
		tabContent?.setAttribute('style', 'display: block;');
		return;
	}

	tabContent?.setAttribute('style', 'display: block;');
	updateScrollbar();
}

showPopupBtn.addEventListener('click', showPopup);

popupOverlay.addEventListener('click', hidePopup);

userInfoLogoutBtn.addEventListener('click', () => {
	FORM_KEYS.forEach((formKey) => {
		setInLocalStorage(formKey, '');
	});
	showDefaultHeader();
});

userInfoText.addEventListener('click', () => {
	userInfoText.classList.add(HIDE_CLASS);
	userInfoInput.classList.remove(HIDE_CLASS);

	userInfoInput.value = userInfoText.textContent;
	userInfoInput.focus();
});

userInfoInput.addEventListener('blur', () => {
	userInfoInput.classList.add(HIDE_CLASS);
	userInfoText.classList.remove(HIDE_CLASS);
	
	userInfoText.textContent = userInfoInput.value;
	
	if (isEntered) {
		setInLocalStorage(LOGIN_KEY, userInfoInput.value);
	}
});

const handleForm = () => {
	const checkboxState = rememberCheckbox.checked;
	const loginValue = loginInput.value;
	const passwordValue = passwordInput.value;
	const values = [loginValue, passwordValue, checkboxState];
	
	if (!loginValue || !passwordValue) {
		return;
	}

	if (checkboxState) {
		FORM_KEYS.forEach((formKey, index) => {
			setInLocalStorage(formKey, values[index]);
		});
		updateUserInfoText(getFromLocalStorage(LOGIN_KEY));
	} else {
		updateUserInfoText(loginValue);
	}
	
	rememberCheckbox.checked = false;
	loginInput.value = '';
	passwordInput.value = '';

	hidePopup();
	showLoggedInUser();
};

enterFormBtn.addEventListener('click', handleForm);


