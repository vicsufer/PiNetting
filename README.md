# PiNetting
A web service to manage your local network devices.


Table of Contents
=================

  * [Features](#features)
  * [Setup](#setup)
    * [Requirements](#requirements)
    * [Install](#install)
    * [Run](#run)
  * [Usage](#usage)

## Features
   - Monitoring connected devices at local network (IPv4).
   - Register known devices.
   - WakeOnLan and shutdown for registered devices.
   - Activity logs.

## Setup

This steps are intended for a Raspberry Pi3
```sh
$ uname -a
Linux raspberrypi 4.14.52-v7+ #1123 SMP Wed Jun 27 17:35:49 BST 2018 armv7l GNU/Linux
$ cat /etc/os-release
PRETTY_NAME="Raspbian GNU/Linux 9 (stretch)"
NAME="Raspbian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=raspbian
ID_LIKE=debian
HOME_URL="http://www.raspbian.org/"
SUPPORT_URL="http://www.raspbian.org/RaspbianForums"
BUG_REPORT_URL="http://www.raspbian.org/RaspbianBugs"
```
### Requirements
They can be installed by means of aptitude package manager.
  - git
  - Node.js
  - npm
  - MongoDB (2.4.14)
  - nmap
  - samba-common-bin
### Install
```sh
$ git clone https://github.com/ByBordex/PiNetting.git
$ cd PiNetting
$ npm install
$ mkdir logs
```
If the log folder is not created activity logs will not be stored.
### Configuration
PiNetting uses several environmental variables located in the pakage.json file and which can be tweaked:
  - hostip: IP Of the device where PiNetting will be running.
  - port: Port used for the web service.
  - iprange: Subnetwork in which to perform discovery of devices. Ej: 192.168.0.1/24
  - scanfrequency: Period of time (In milliseconds) between nmap scans.
  - mongodb: MongoDB server path.

 Default config values:
```json
"config": {
    "port": 5000,
    "iprange": "192.168.0.1/24",
    "hostip": "192.168.0.2",
    "scanfrequency": 4000,
    "mongodb": "mongodb://localhost:27017/network_devices"
  }
```
Values of the environmental variables can be tweaked directly in the package.json file, however alterantively they can be modified by means of npm as stated at the [official pages](https://docs.npmjs.com/misc/config#per-package-config-settings).
```sh
$ npm config set pinetting:<variable> <value>
```    
### Run
It is very important to run PiNetting using npm instead of just node since it will load the environmental variables.
Also it should run with permissions. (**Do not use sudo**, the password will be prompted a few seconds after the start.)
```sh
$ npm start
```

## Usage
Open a web browser and type \<hostip\>:\<port\> (Ej: 192.168.0.2:5000) to access the web service.

### WakeOnLan & Shutdown
The devices that will be allowed to perform wakeonlan and remote shutdown must be prepared for it, the method differs depending on the OS.

Also notice that WakeOnLan must be supported by the motherboard of the device and can only be performed if it is connected via ethernet.

For shutdown username/password of an account with remote shutdown permissions must be provided.
