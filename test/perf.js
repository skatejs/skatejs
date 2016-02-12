import './boot';
import './perf/create-element';
import './perf/inserting-elements';
import './perf/upgrading';

alert('NOTE: Any native methods that lack support in the browser you are running these tests in will be polyfilled via WebComponentsJS. This is intentional so that we can benchmark performance against their polyfills.');
