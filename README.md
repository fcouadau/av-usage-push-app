AirVantage usage push application
=================================

This application is a sample to demonstrate reading usage records from a Mobile Network Operator's platform, and pushing them into AirVantage.

It plugs into AirVantage using a valid user account. The user account must have the `entities.systems.usages.create` right, or else pushing won't work.

Modules
--------

The application does not have any UI. It is composed of several modules:

* `app.js`: Main entry point of the application.
* `lib/util.js`: Utility functions.
* `lib/airvantage_api.js`: Talks to AirVantage's APIs (and more specifically push usage data).
* `lib/empty_mno_api.js`: Empty shell showcasing the usage read function.
* `lib/stub_mno_api.js`: Stub implementation of `empty_mno_api.js`. Demonstrates a simple, stubbed construction of an AV-compatible CSV.

Installing & running
--------------------

To run the application:

* Open file `config/development.json`. Update it with your credentials.
* Install dependencies using `npm install`.
* Launch the application using `npm start`.
* Traces will be generated in the console and in `log/development.log.2015-03-27`.

Implementing your own MNO
-------------------------

To implement a specific MNO's platform.

* Open folder `lib`. Copy file `empty_mno_api.js` and rename it `<your_mno>_api.js`.
* Implement the `extract_usages` method, as indicated in the comments.
* In `config/development.json`, set parameter `mno.implementation` to the file name you chose, minus the extension (e.g. `<your_mno>_api`).
* Test your app with `npm start`.

Deploying in production
-----------------------

The following steps should allow you to install the app on a brand new Amazon EC2 t2.micro instance.

#### Machine installation
* Create a new Amazon EC2 t2.micro instance.
* Make sure the instance allows inbound SSH (port `22`) from your machine.
* SSH into the machine and run the following commands:
    * `sudo apt-get nodejs`

#### Basic configuration
* Retrieve your webapp folder on the machine using the means of your choice (Git, zip file upload, etc).
* Make sure your MNO-specific implementation is present in the `lib` folder.
* Open file `config/production.json`. Update it with your AirVantage credentials. Make sure `mno.implementation` is set to your MNO. Add your MNO-specific configuration as needed.
* Install dependencies using `npm install`.

#### Server start
* Launch the application with `npm start`.
* You can access the logs in the console and the `log` folder.