
function errAction(err){
	if(err === '1'){
		alert('로그아웃 됐습니다');
		window.location.href='/';
	}else{
		alert('에러정보 : '+err );
	}
}

export default errAction;
