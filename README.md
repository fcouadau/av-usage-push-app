AVEP Generic demo
=================

This application is a generic tool to demonstrate AirVantage Entreprise Platform (AVEP) to potential prospects.

It plugs on any AirVantage environment, using any valid AirVantage account. Login is deferred to the selected AirVantage instance. Once logged in, the user can customize the look & feel of the application (logo, color, labels, etc). They can then display a dashboard showing their customized app.

The application works best with an AVEP demo kit, comprised of an LX/GX device paired with a button/LED and running a specific program.

Features
--------

The application is composed of several screens:

* Login: defers authentication to a user-selected AirVantage instance.
* Dashboard: displays the state and data of the currently-selected system. When an alert is detected on the device, the dashboard updates accordingly, and a single alert SMS can be sent out.
* Configure: provides a way of configuring the monitored system, the look & feel of the application, a phone number & text for the alert SMS, and the monitored system data.
* Code insight: if the public is a bit technical in nature, this screen shows how AirVantage API queries are made and what kind of raw results they return, using a chart as an example.

Installing & running
--------------------

To run the application:

* Open file `airvantage.yml`. Update it with API client IDs and secrets for each environment.
* Open file `twilio.yml`. Update it with your Twilio credentials for each environment.
* Launch the application using rails.
* You can access the application at: `http://localhost:3000` and login with your AirVantage credentials.

Implementing your own MNO
-------------------------

TODO

Database
--------

TODO

Modules
-------

The following modules are present:

* `application_controller.rb`: Handles security by redirecting users to the login page if they are not authenticated.
* `login_controller.rb`: Handles login (deferred to AirVantage using Resource Owner Flow) and logout.
* `dashboard_controller.rb`: Handles dashboard display.
* `configurations_controller.rb`: Handles configuration display, edition and storage.
* `code_insight_controller.rb`: Handles code insight page display.
* `sms_controller.rb`: Handles SMS sending (using Twilio). Triggered by the dashboard view when an alert is detected.

Tests
-----

TODO

Deploying in production
-----------------------

The following steps should allow you to install the app on a brand new Amazon EC2 t2.micro instance. The app is deployed within a standalone Puma server (no Apache/NGINX) using a self-signed SSL certificate.

#### Machine installation
* Create a new Amazon EC2 t2.micro instance.
* Make sure the instance allows inbound SSH (port `22`) from your machine, as well as inbound HTTP (port `80`) and HTTPS (port `443`) from anywhere.
* SSH into the machine and run the following commands:
    * `sudo apt-get update`
    * `sudo apt-get install ruby-railties-4.0`
    * `sudo apt-get install ruby1.9.1-dev`
    * `sudo apt-get install make`
    * `sudo apt-get install libssl-dev`
    * `sudo apt-get install libsqlite3-dev`
    * `sudo apt-get install g++`

#### Basic configuration
* Retrieve the webapp folder on the machine using the means of your choice (Git, zip file upload, etc).
* Open file `config/airvantage.yml`. Update it with API client IDs and secrets for each environment.
* Open file `config/twilio.yml`. Update it with your Twilio credentials for each environment.

#### Gem installation
* Set rails environment to production with `export RAILS_ENV=production`
* Run `gem install bundler`.
* Run `bundle install`.

#### Database
* Run `bundle exec rake db:setup`.
* Run `bundle exec rake db:migrate`.
* Run `rake secret`. Copy the output and paste it into file `config/secrets.yml`, under `:production`.
* Run `rake assets:precompile`.

#### Certificate generation
* Create a directory for the certificate with `mkdir /bin/ssl && cd /bin/ssl`.
* Generate the self-signed certificate: `openssl req -new -newkey rsa:2048 -sha1 -days 365 -nodes -x509 -keyout server.key -out server.crt Generating a 2048 bit RSA private key`.
* Fill in the questions. Two files will be generated: `server.key` and `server.crt`.

#### Server start
* Launch Puma with `sudo puma -d -e production -p 80 -b 'ssl://0.0.0.0:443?key=/bin/ssl/server.key&cert=/bin/ssl/server.crt'`.
* You can access the application at: `https://<Amazon_machine_public_DNS>` and login with your AirVantage credentials.
* Notes:
    * On your first access, you'll have to accept the self-signed certificate.
    * This configuration allows access using both HTTP (port`80`) and HTTPS (port `443`). There is an automatic redirect to HTTPS.
