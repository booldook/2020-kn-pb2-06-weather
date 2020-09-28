/******************* 전역설정 ********************/
var kakaoKey = '644d617a85cb7f28982d642138d22c33';
var appid = '02efdd64bdc14b279bc91d9247db4722';
var dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
var weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
var sendData = { units: 'metric', lang: 'kr', appid: appid }

/************** 카카오 지도 연동 **************/
// 1. 지도를 화면에 생성한다.
// 2. 도시정보를 불러와서 openweathermap에 정보를 요청한다.
// 3. 콜백된 각 도시의 날씨정보를 기존에 생성한 지도에 나타낸다.
var container, options, map;
container = document.getElementById('map');
options = {
	center: new kakao.maps.LatLng(35.82, 127.44),
	level: 13
};
map = new kakao.maps.Map(container, options);
map.setDraggable(false);
map.setZoomable(false);
// map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

$.get('../json/city.json', onGetCity);
function onGetCity(r) {
	// console.log(r);
	r.cities.forEach(function(v, i){
		sendData.lat = v.lat;
		sendData.lon = v.lon;
		$.get(dailyURL, sendData, onGetDaily);
	});
}
function onGetDaily(r) {
	// console.log(r);
	var icon = 'https://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	var html;
	if(r.id == 1835848 || r.id == 1841811) html = '<div class="custom-window lt">';
	else if(r.id == 1841066 || r.id == 1843564) html = '<div class="custom-window rt">';
	else html = '<div class="custom-window">';
	html += '<img src="'+icon+'" style="width: 40px;">';
	html += '<div>온도 <b>'+r.main.temp+'</b>℃<br>체감 <b>'+r.main.feels_like+'</b>℃</div>';
	html += '<img src="../img/triangle.png" class="triangle">'
	html += '</div>';
	var position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon);
	var customWindow = new kakao.maps.CustomOverlay({
			position : position, 
			content : html
	});
	customWindow.setMap(map);
}

/************** 현재위치 날씨 정보 **************/
navigator.geolocation.getCurrentPosition(onGetPositon, onErrorPosition);
function onGetPositon(r) {
	sendData.lat = r.coords.latitude;
	sendData.lon = r.coords.longitude;
	$.get(dailyURL, sendData, onGetDailyPosition);
}
function onErrorPosition(e) {
	console.log(e);
}
function onGetDailyPosition(r) {
	console.log(r);
}


