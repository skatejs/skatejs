// Only require the dynamic components.
//
// NOTE Anything that is a descendant of a dynamic component that gets
// rehydrated must have rehydration enabled and be delivered to the client.
import './components/code';
import './components/example';
import './components/runnable';
import './components/tabs';

// We must load the samples so that they can be run.
import '../test/samples/with-component';
