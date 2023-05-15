import React, { Component } from 'react';

import linkedinShareButton from './linkedin-share-button.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: false,
      shareUrnId: '',
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.handlePostMessage);
  }

  handlePostMessage = (event) => {
    if (event.data.type === 'shareUrn') {
      this.updateProfile(event.data.shareUrn.id);
      alert(`Post successful - ${event.data.shareUrn.id}`);
    }
  };

  updateProfile = (shareUrnId) => {
    this.setState({
      isAuthorized: true,
      shareUrnId,
    });
  };

  requestProfile = () => {
    var oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=r_liteprofile,r_organization_social,rw_organization_admin,w_member_social,w_organization_social,r_organization_admin&state=123456&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;
    var width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;

    window.open(
      oauthUrl,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left,
    );
  };

  postUgc = () => {
    window.open(process.env.REACT_APP_REDIRECT_URI);
  };

  render() {
    return (
      <img
        src={linkedinShareButton}
        alt="linkedin-share"
        height="75"
        onClick={this.state.isAuthorized ? this.postUgc : this.requestProfile}
        style={{ cursor: 'pointer' }}
      />
    );
  }
}

export default App;
