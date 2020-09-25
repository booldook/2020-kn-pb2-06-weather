/******************* 전역설정 ********************/
var kakaoKey = '644d617a85cb7f28982d642138d22c33';
var appid = '02efdd64bdc14b279bc91d9247db4722';
var dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
var weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
var sendData = { units: 'metric', lang: 'kr', appid: appid }

/************** 카카오 지도 연동 **************/
sendData.lat = 37.56826;
sendData.lon = 126.977829;
$.get(dailyURL, sendData, onKoreaWeather);
function onKoreaWeather(r) {
	console.log(r);
	var container = document.getElementById('map');
	var options = {
		center: new kakao.maps.LatLng(35.823107, 128.118022),
		level: 13
	};
	var map = new kakao.maps.Map(container, options);
	map.setDraggable(false);
	map.setZoomable(false);
	map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

	var html = '<div>';
	html += '<img src="https://openweathermap.org/img/w/'+r.weather[0].icon+'.png">';
	html += r.main.temp+'도/체감 '+r.main.feels_like+'도';
	html += '</div>';
	var iwPosition = new kakao.maps.LatLng(r.coord.lat, r.coord.lon);
	var infowindow = new kakao.maps.InfoWindow({
			map: map,
			position : iwPosition, 
			content : html
	});
}
