import React, { Component } from 'react';
import axios from 'axios';
import Button from "components/CustomButton/CustomButton.jsx";
import cp from '../../cp';
import './login.scss';

export class LoginComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            passwd: '' ,
						jump : '' ,
        };
		}

		componentDidMount() {
			this._input.focus();
		}

    login() {
			if (this.state.userId === '' || this.state.passwd === '') {
				return alert('이메일 혹은 비밀번호를 입력해주세요');
			}
			axios.post(cp.server_ip+'/api/login', {
				id: this.state.userId,
				pass: this.state.passwd,
				isAdmin: true,
			}).then(res => {
				if (!res.data.err && res.data.token) {
					window.localStorage['nu_id'] = res.data.token.userId;
					window.localStorage['nu_token'] = res.data.token.token;
					window.location.href='/';
					return false;
				}
				// not join or invaild password
				if (res.data.errStatus === 1 || res.data.errStatus === 2) {
					alert('정보를 확인해주세요.');
				} else if(res.data.errStatus === 25) {
					alert('관리자가 아닙니다.');
				} else {
					alert('관리자에게 문의하세요.');
				}
			}).catch(err => { console.log(err); });
		}

    render() {
			const enterEvent = e =>  e.key === 'Enter' ? this.login() : false;
			return (
				<div className='login-wrap'>
					<div className='login-box'>
						<form className="login-form">

							<div className="login-field login-email-box">
								<span className="login-email-text" >
									Email
								</span>
								<div className="login-email-input" data-validate="Username is required">
									<input
										className="email-input"
										type="text"
										name="email"
										value={ this.state.userId }
										onChange= {e => this.setState({ userId: e.target.value }) }
										onKeyPress={enterEvent}
										autoFocus
										ref={c => (this._input = c)}/>
								</div>
							</div>

							<div className="login-field login-password-box">
								<span className="login-password-text">
									Password
								</span>
								<div className="login-password-input" data-validate="Password is required">
									<input
										className="password-input"
										type="password"
										name="pass"
										value={this.state.passwd}
										onChange={ e => this.setState({ passwd: e.target.value }) }
										onKeyPress={enterEvent}/>
								</div>
							</div>

							<div className="login-field login-button-box">
								<Button bsStyle="info" simple type="button" bsSize="small" onClick={e => this.login()}>
									Login
								</Button>
							</div>
						</form>
					</div>
				</div>
			);
    }
}

export default LoginComp;
