/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom'

import HomePage from '~/src/theme/routes/HomePage.js';
import About from '~/src/theme/routes/About.js';
import HowItWorks from '~/src/theme/routes/HowItWorks.js';
import ICO from '~/src/theme/routes/ICO.js';
import Roadmap from '~/src/theme/routes/Roadmap.js';
import SearchPage from '~/src/theme/routes/SearchPage.js'
import UserProfile from '~/src/theme/routes/UserProfile';
import Authorize from '~/src/authentication/Authorize';
import SignUpFormPopup from  '~/src/authentication/SignUpForm';


class Main extends React.Component {
  render() {
    return (
      <main>
      <SignUpFormPopup modalIsOpen={this.props.isSignUpFormOpen} 
          onCloseModal={() => this.props.onCloseSignUpModal()}
          onHandleSignUpFacebook={()=>this.props.onHandleSignUpFacebook()}
          onHandleSignUpLinkedIn={()=>this.props.onHandleSignUpLinkedIn()}
      />
      <Switch>
        <Route exact path='/' render={routeProps => <HomePage {...routeProps}{...this.props}/>} />
        <Route exact path='/about' render={routeProps => <About {...routeProps}{...this.props}/>} />
        <Route exact path='/howItWorks' render={routeProps => <HowItWorks {...routeProps}{...this.props}/>} />
        <Route exact path='/ico' render={routeProps => <ICO {...routeProps}{...this.props}/>} />
        <Route exact path='/roadmap' render={routeProps => <Roadmap {...routeProps}{...this.props}/>} />
        <Route path='/searchResults' render={routeProps => <SearchPage {...routeProps}{...this.props}/>} />
        <Route path='/userProfile' render={routeProps => <UserProfile {...routeProps}{...this.props}/>} />)}/>
        <Route path='/authorize' render={routeProps => <Authorize {...routeProps}{...this.props}/>} />)}/>
  )}/>

      </Switch>
    </main>
    );
  }

}

export default Main;