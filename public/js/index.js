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
	var container, options, map, html, position, customWindow, icon;
	
	container = document.getElementById('map');
	options = {
		center: new kakao.maps.LatLng(35.823107, 128.118022),
		level: 13
	};
	map = new kakao.maps.Map(container, options);
	map.setDraggable(false);
	map.setZoomable(false);
	// map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

	icon = 'https://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	html = '<div class="custom-window triangle">';
	html += '<img src="'+icon+'" style="width: 40px;">';
	html += '<div>온도 '+r.main.temp+'℃<br>체감 '+r.main.feels_like+'℃</div>';
	html += '</div>';
	position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon);
	customWindow = new kakao.maps.CustomOverlay({
			position : position, 
			content : html
	});
	customWindow.setMap(map);
}
