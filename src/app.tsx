import React from 'react';
import { Header } from './components/Header'
import { Navigation } from './components/Navigation'
import { Content } from './components/Content'
import { BrowserRouter } from 'react-router-dom';

export class App extends React.Component{
    render() {
        return (
            <div>
                <div className="container-fluid">
                    <Header />
                </div>
                <div className="container-fluid">
                    <div className="row" style={{margin: 0}}>
                        <BrowserRouter>
                            <Navigation />
                            <Content />
                        </BrowserRouter>
                    </div>
                </div>
            </div>
         );
    };
}
