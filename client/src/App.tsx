import React from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/chakra/toaster";
import Builder from "@/pages/builder";
import { Provider } from "@/components/chakra/provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Builder} />
    </Switch>
  );
}

function App() {
  return (
    <Provider>
      <Router />
      <Toaster />
    </Provider>
  );
}

export default App;
