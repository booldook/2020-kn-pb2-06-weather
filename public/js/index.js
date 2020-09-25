/******************* 전역설정 ********************/
var kakaoKey = '644d617a85cb7f28982d642138d22c33';
var appid = '02efdd64bdc14b279bc91d9247db4722';
var dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
var weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
var sendData = { units: 'metric', lang: 'kr', appid: appid }

/************** 카카오 지도 연동 **************/
var container = document.getElementById('map');
var options = {
	center: new kakao.maps.LatLng(35.823107, 128.118022),
	level: 13
};
var map = new kakao.maps.Map(container, options);
