import React, { Component } from 'react';
import axios from 'axios';
import cp from '../../cp';

export class LoginComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            passwd: '' ,
						jump : '' ,
        };
    }

    // API를 호출하고 응답받은 토큰을 localStorage에 저장하기 --- (※1)
    api(command) {
        if(command == 'adminCheck'){
            if(this.state.userId != '' && this.state.passwd != ''){
                axios.post(cp.server_ip+'/api/users', {
                    proc: command,
                    userId: this.state.userId,
                    passwd: this.state.passwd
                }).then(res => {

                    const r = res.data;
                    if(r.msg == '1'){
                        alert('미갑입된 아이디 입니다.');
                    }else if(r.msg == '2'){
                        alert('비밀번호가 맞지 않습니다.');
                    }else if(r.msg == '4'){
                        alert('관리자가 아닙니다.');
                    }else if (r.status && r.token) {
                        // 인증 토큰을 localStorage에 저장하기
                        window.localStorage['nu_id'] = r.token.userId;
                        window.localStorage['nu_token'] = r.token.token;
                        window.location.href='/';
                    }
                }).catch(err => { console.log(err); });
            }else{
                alert('이메일 혹은 비밀번호를 입력해주세요');
            }
				}
		}

    render() {
					const changed = (name, e) => this.setState({ [name]: e.target.value });
					return (

							<div>
									<div className="limiter">
											<div className="container-login100">
													<div className="wrap-login100 p-l-110 p-r-110 p-b-33">
															<p className='loginTitle' >Login</p>
															<form className="login100-form validate-form flex-sb flex-w">
																	<div className="p-t-31 p-b-9">
																			<span className="txt1" >
																					Email
																			</span>
																	</div>
																	<div className="wrap-input100 validate-input" data-validate="Username is required">
																			<input className="input100 email" type="text" name="email"  value={this.state.userId} onChange={e => changed('userId', e)}/>
																			<span className="focus-input100"></span>
																	</div>

																	<div className="p-t-13 p-b-9">
																			<span className="txt1">
																					Password
																			</span>

																			<a href="#" className="txt2 bo1 m-l-5">
																					Forgot?
																			</a>
																	</div>



																	<div className="wrap-input100 validate-input" data-validate="Password is required">
																			<input className="input100 pass" type="password" name="pass" value={this.state.passwd}  onChange={e => changed('passwd', e)}/>
																			<span className="focus-input100"></span>
																	</div>

																	<div className="container-login100-form-btn m-t-30 m-b-20">
																			<div className="login100-form-btn login" onClick={e => this.api('adminCheck')}>
																					Login
																			</div>
																	</div>


															</form>
													</div>
											</div>
									</div>
							</div>

					);


    }
}


export default LoginComp;
