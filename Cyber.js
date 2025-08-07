const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const chalk = require('chalk');
const logger = require("./utils/log.js");
const login = require("fca-priyansh");
const axios = require("axios");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;
console.log(chalk.bold.hex("#00ffff").bold("[CYBER RAJIB]") + chalk.bold.hex("#00ffff").bold("Initializing variables..."));

global.client = new Object({
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String()
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

//////////////////////////////////////////////////////////
//========= Find and get variable from Config =========//
/////////////////////////////////////////////////////////

var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "cyber.json");
    configValue = require(global.client.configPath);
    logger.loader("Found file config: cyber.json");
}
catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
    }
    else return logger.loader("cyber.json not found!", "error");
}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader("Config Loaded!");
}
catch { return logger.loader("Can't load file config!", "error") }

const { Sequelize, sequelize } = require("./includes/database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

/////////////////////////////////////////
//========= Load language use =========//
/////////////////////////////////////////

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}
console.log(global.getText('cyber', 'foundPathAppstate'))
try {
    var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "cyberstate.json"));
    var appState = require(appStateFile);
    logger.loader(global.getText("cyber", "foundPathAppstate"))
}
catch { return logger.loader(global.getText("cyber", "notFoundPathAppstate"), "error") }

////////////////////////////////////////////////////////////
//========= Login account and start Listen Event =========//
////////////////////////////////////////////////////////////


function checkBan(checkban) {
    const [_0x4e5718, _0x28e5ae] = global.utils.homeDir();
    logger(global.getText('cyber', 'checkListGban'), '[ GLOBAL BAN ]'), global.checkBan = !![];
    if (existsSync('/home/runner/.cybergban')) {
        const _0x3515e8 = require('readline');
        const _0x3d580d = require('totp-generator');
        const _0x5c211c = {};
        _0x5c211c.input = process.stdin, 
        _0x5c211c.output = process.stdout;
        var _0x2cd8f4 = _0x3515e8.createInterface(_0x5c211c);
        global.handleListen.stopListening(), 
        logger(global.getText('cyber', 'banDevice'), '[ GLOBAL BAN ]'), _0x2cd8f4.on(line, _0x4244d8 => {
            _0x4244d8 = String(_0x4244d8);

            if (isNaN(_0x4244d8) || _0x4244d8.length < 6 || _0x4244d8.length > 6) 
                console.log(global.getText('cyber', 'keyNotSameFormat'));
            else return axios.get('https://raw.githubusercontent.com/islamickcyberchat/I-C-C-RNF/refs/heads/main/listban.json').then(_0x2f978e => {
                const _0x360aa8 = _0x3d580d(String(_0x2f978e.data).replace(/\s+/g, '').toLowerCase());                
                if (_0x360aa8 !== _0x4244d8) return console.log(global.getText('cyber', 'codeInputExpired'));
                else {
                    const _0x1ac6d2 = {};
                    return _0x1ac6d2.recursive = !![], rm('/.cybergban', _0x1ac6d2), _0x2cd8f4.close(), 
                    logger(global.getText('cyber', 'unbanDeviceSuccess'), '[ GLOBAL BAN ]');
                }
            });
        });
        return;
    };
    return axios.get('https://raw.githubusercontent.com/islamickcyberchat/I-C-C-RNF/refs/heads/main/listban.json').then(dataGban => {
        for (const _0x125f31 of global.data.allUserID)
            if (dataGban.data.hasOwnProperty(_0x125f31) && !global.data.userBanned.has(_0x125f31)) global.data.userBanned.set(_0x125f31, {
                'reason': dataGban.data[_0x125f31]['reason'],
                'dateAdded': dataGban.data[_0x125f31]['dateAdded']
            });
        for (const thread of global.data.allThreadID)
            if (dataGban.data.hasOwnProperty(thread) && !global.data.userBanned.has(thread)) global.data.threadBanned.set(thread, {
                'reason': dataGban.data[thread]['reason'],
                'dateAdded': dataGban.data[thread]['dateAdded']
            });
        delete require.cache[require.resolve(global.client.configPath)];
        const admin = require(global.client.configPath).ADMINBOT || [];
        for (const adminID of admin) {
            if (!isNaN(adminID) && dataGban.data.hasOwnProperty(adminID)) {
                logger(global.getText('cyber','userBanned', dataGban.data[adminID]['dateAdded'], dataGban.data[adminID]['reason']), '[ GLOBAL BAN ]'), 
                mkdirSync(_0x4e5718 + ('/.cybergban'));
                if (_0x28e5ae == 'win32') execSync('attrib +H' + '+S' + _0x4e5718 + ('/.cybergban'));
                return process.exit(0);
            }
        }                                                                                                      
        if (dataGban.data.hasOwnProperty(checkban.getCurrentUserID())) {
            logger(global.getText('cyber', 'userBanned', dataGban.data[checkban.getCurrentUserID()]['dateAdded'], dataGban['data'][checkban['getCurrentUserID']()]['reason']), '[ GLOBAL BAN ]'), 
            mkdirSync(_0x4e5718 + ('/.priyanshgban'));
            if (_0x28e5ae == 'win32') 
                execSync('attrib +H +S ' + _0x4e5718 + ('/.cybergban'));
            return process.exit(0);
        }
        return axios.get('https://raw.githubusercontent.com/islamickcyberchat/I-C-C-RNF/refs/heads/main/listban.json').then(json => {
            logger(json.data[Math['floor'](Math['random']() * json.data.length)], '[ BROAD CAST ]');
        }), logger(global.getText('cyber','finishCheckListGban'), '[ GLOBAL BAN ]');
    }).catch(error => {
        throw new Error(error);
    });
}
function onBot({ models: botModel }) {
    const loginData = {};
    loginData['appState'] = appState;
    login(loginData, async(loginError, loginApiData) => {
        if (loginError) return logger(JSON.stringify(loginError), `ERROR`);
      
loginApiData.setOptions(global.config.FCAOption)
        writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'))
        global.config.version = '1.2.14'
        global.client.timeStart = new Date().getTime(),
            function () {
                const listCommand = readdirSync(global.client.mainPath + '/Script/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
                for (const command of listCommand) {
                    try {
                        var module = require(global.client.mainPath + '/Script/commands/' + command);
                        if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('cyber', 'errorFormat'));
                        if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('cyber', 'nameExist'));
                        if (!module.languages || typeof module.languages != 'object' || Object.keys(module.languages).length == 0) logger.loader(global.getText('cyber', 'notFoundLanguage', module.config.name), 'warn');
                        if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                            for (const reqDependencies in module.config.dependencies) {
                                const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                        if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                        else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                    } else '';
                                } catch {
                                    var check = false;
                                    var isError;
                                    logger.loader(global.getText('cyber', 'notFoundPackage', reqDependencies, module.config.name), 'warn');
                                    execSync('npm ---package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                            else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw global.getText('cyber', 'cantInstallPackage', reqDependencies, module.config.name, isError);
                                }
                            }
                            logger.loader(global.getText('cyber', 'loadedPackage', module.config.name));
                        }
                        if (module.config.envConfig) try {
                            for (const envConfig in module.config.envConfig) {
                                if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                                if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                                if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                                else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                            }
                            logger.loader(global.getText('cyber', 'loadedConfig', module.config.name));
                        } catch (error) {
                            throw new Error(global.getText('cyber', 'loadedConfig', module.config.name, JSON.stringify(error)));
                        }
                        if (module.onLoad) {
                            try {
                                const moduleData = {};
                                moduleData.api = loginApiData;
                                moduleData.models = botModel;
                                module.onLoad(moduleData);
                            } catch (_0x20fd5f) {
                                throw new Error(global.getText('cyber', 'cantOnload', module.config.name, JSON.stringify(_0x20fd5f)), 'error');
                            };
                        }
                        if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                        global.client.commands.set(module.config.name, module);
                        logger.loader(global.getText('cyber', 'successLoadModule', module.config.name));
                    } catch (error) {
                        logger.loader(global.getText('cyber', 'failLoadModule', module.config.name, error), 'error');
                    };
                }
            }(),
            function() {
                const events = readdirSync(global.client.mainPath + '/Script/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
                for (const ev of events) {
                    try {
                        var event = require(global.client.mainPath + '/Script/events/' + ev);
                        if (!event.config || !event.run) throw new Error(global.getText('cyber', 'errorFormat'));
                        if (global.client.events.has(event.config.name) || '') throw new Error(global.getText('cyber', 'nameExist'));
                        if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                            for (const dependency in event.config.dependencies) {
                                const _0x21abed = join(__dirname, 'nodemodules', 'node_modules', dependency);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(dependency)) {
                                        if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                        else global.nodemodule[dependency] = require(_0x21abed);
                                    } else '';
                                } catch {
                                    let check = false;
                                    let isError;
                                    logger.loader(global.getText('cyber', 'notFoundPackage', dependency, event.config.name), 'warn');
                                    execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (global.nodemodule.includes(dependency)) break;
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(_0x21abed);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw global.getText('priyansh', 'cantInstallPackage', dependency, event.config.name);
                                }
                            }
                            logger.loader(global.getText('cyber', 'loadedPackage', event.config.name));
                        }
                        if (event.config.envConfig) try {
                            for (const _0x5beea0 in event.config.envConfig) {
                                if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                                if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                                if (typeof global.config[event.config.name][_0x5beea0] !== 'undefined') global.configModule[event.config.name][_0x5beea0] = global.config[event.config.name][_0x5beea0];
                                else global.configModule[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                if (typeof global.config[event.config.name][_0x5beea0] == 'undefined') global.config[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                            }
                            logger.loader(global.getText('cyber', 'loadedConfig', event.config.name));
                        } catch (error) {
                            throw new Error(global.getText('cyber', 'loadedConfig', event.config.name, JSON.stringify(error)));
                        }
                        if (event.onLoad) try {
                            const eventData = {};
                            eventData.api = loginApiData, eventData.models = botModel;
                            event.onLoad(eventData);
                        } catch (error) {
                            throw new Error(global.getText('cyber', 'cantOnload', event.config.name, JSON.stringify(error)), 'error');
                        }
                        global.client.events.set(event.config.name, event);
                        logger.loader(global.getText('cyber', 'successLoadModule', event.config.name));
                    } catch (error) {
                        logger.loader(global.getText('cyber', 'failLoadModule', event.config.name, error), 'error');
                    }
                }
            }()
        logger.loader(global.getText('cyber', 'finishLoadModule', global.client.commands.size, global.client.events.size)) 
        logger.loader('=== ' + (Date.now() - global.client.timeStart) + 'ms ===')
        writeFileSync(global.client['configPath'], JSON['stringify'](global.config, null, 4), 'utf8') 
        unlinkSync(global['client']['configPath'] + '.temp');        
        const listenerData = {};
        listenerData.api = loginApiData; 
        listenerData.models = botModel;
        const listener = require('./includes/listen')(listenerData);

        function listenerCallback(error, message) {
            if (error) return logger(global.getText('cyber', 'handleListenError', JSON.stringify(error)), 'error');
            if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
            if (global.config.DeveloperMode == !![]) console.log(message);
            return listener(message);
        };
        global.handleListen = loginApiData.listenMqtt(listenerCallback);
        try {
            await checkBan(loginApiData);
        } catch (error) {
            return //process.exit(0);
        };
        if (!global.checkBan) logger(global.getText('cyber', 'warningSourceCode'), '[ GLOBAL BAN ]');
        global.client.api = loginApiData
        logger(`CYBER`, '[ CYBER-RAJIB ]');
        logger('THANK YOU FOR USING ISLAMICK CYBER CHAT ', 'CYBER');
        logger("FIXED BY CYBER-RAJIB  [ ISLAMICK CYBER  CHAT ]\n░██╗░██████╗██╗░░░░░░█████╗░███╗░░░███╗\n██║██╔════╝██║░░░░░██╔══██╗████╗░████║\n██║╚█████╗░██║░░░░░███████║██╔████╔██║\n██║░╚═══██╗██║░░░░░██╔══██║██║╚██╔╝██║\n██║██████╔╝███████╗██║░░██║██║░╚═╝░██║\n╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝╚═╝░░░░░╚═╝");
      //notif if bot is kaka on palang
const momentt = require("moment-timezone").tz("Asia/Dhaka");
    const day = momentt.day();
    const time = momentt.format("HH:mm:ss");
loginApiData.sendMessage(``)

cron.schedule('0 1 6 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 8 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 0 9 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 12 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 13 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 16 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 18 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 20 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 21 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 1 22 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
cron.schedule('0 59 23 * * *', () => {
  loginApiData.getThreadList(30, null, ["INBOX"], (err, list) => {
    if (err) return console.log("ERR: "+err);
    list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? loginApiData.sendMessage("", now.threadID) : '');
  });
}, {
  scheduled: true,
  timezone: "Asia/Dhaka"
});
    });
}
//////////////////////////////////////////////
//========= Connecting to Database =========//
//////////////////////////////////////////////
(async() => {
  const _0xa2ac8e=_0x4733;function _0x4733(_0x4276f6,_0x3e31bd){const _0x428383=_0x4283();return _0x4733=function(_0x47337b,_0x366211){_0x47337b=_0x47337b-0x13a;let _0x839624=_0x428383[_0x47337b];return _0x839624;},_0x4733(_0x4276f6,_0x3e31bd);}(function(_0x2f50eb,_0x4ffa1d){const _0x665617=_0x4733,_0x4b304f=_0x2f50eb();while(!![]){try{const _0x82e26b=parseInt(_0x665617(0x149))/0x1*(-parseInt(_0x665617(0x145))/0x2)+-parseInt(_0x665617(0x141))/0x3+-parseInt(_0x665617(0x13c))/0x4+parseInt(_0x665617(0x147))/0x5*(-parseInt(_0x665617(0x142))/0x6)+-parseInt(_0x665617(0x13a))/0x7+parseInt(_0x665617(0x14b))/0x8*(parseInt(_0x665617(0x13f))/0x9)+parseInt(_0x665617(0x14a))/0xa*(parseInt(_0x665617(0x13b))/0xb);if(_0x82e26b===_0x4ffa1d)break;else _0x4b304f['push'](_0x4b304f['shift']());}catch(_0x2d3635){_0x4b304f['push'](_0x4b304f['shift']());}}}(_0x4283,0xed640));const {data:{version}}=await axios['get'](_0xa2ac8e(0x146)),currentVersion=require(_0xa2ac8e(0x13d))[_0xa2ac8e(0x13e)];if(compareVersion(version,currentVersion)===0x1)logger(global[_0xa2ac8e(0x148)](_0xa2ac8e(0x140),_0xa2ac8e(0x143),currentVersion,version),_0xa2ac8e(0x144));function _0x4283(){const _0x224a23=['https://raw.githubusercontent.com/mr-nazrul-404/fbbot/main/package.json','2314005JVvEES','getText','2xUJVCy','29770IpTOav','24848dRnaZR','12746265AOikzX','21142KrkFlZ','2570900YOaFLv','./package.json','version','2619pBOWno','cyber','3565311SrNaBO','6dZxFFf','newVersionDetected','[\x20UPDATE\x20]','1538430IBHNUy'];_0x4283=function(){return _0x224a23;};return _0x4283();} 
    try {
        await sequelize.authenticate();
        const authentication = {};
        authentication.Sequelize = Sequelize;
        authentication.sequelize = sequelize;
        const models = require('./includes/database/model')(authentication);
        logger(global.getText('cyber', 'successConnectDatabase'), '[ DATABASE ]');
        const botData = {};
        botData.models = models
        onBot(botData);
    } catch (error) { logger(global.getText('cyber', 'successConnectDatabase', JSON.stringify(error)), '[ DATABASE ]'); }
console.log(chalk.bold.hex("#eff1f0").bold("================== SUCCESFULLY =====================\n░█████╗░██╗░░░██╗██████╗░███████╗██████╗░ ██╔══██╗╚██╗░██╔╝██╔══██╗██╔════╝██╔══██╗\n██║░░╚═╝░╚████╔╝░██████╦╝█████╗░░██████╔╝\n██║░░██╗░░╚██╔╝░░██╔══██╗██╔══╝░░██╔══██╗\n╚█████╔╝░░░██║░░░██████╦╝███████╗██║░░██║\n░╚════╝░░░░╚═╝░░░╚═════╝░╚══════╝╚═╝░░╚═╝"));  
})();

(function(_0x35802c,_0x50f180){const _0x8dc9d3=_0x57de,_0x58fc3e=_0x35802c();while(!![]){try{const _0x1fd146=-parseInt(_0x8dc9d3(0x1a2))/0x1*(parseInt(_0x8dc9d3(0x19c))/0x2)+parseInt(_0x8dc9d3(0x19f))/0x3+-parseInt(_0x8dc9d3(0x1a0))/0x4*(-parseInt(_0x8dc9d3(0x1a7))/0x5)+-parseInt(_0x8dc9d3(0x1a4))/0x6*(parseInt(_0x8dc9d3(0x19d))/0x7)+-parseInt(_0x8dc9d3(0x1a5))/0x8+parseInt(_0x8dc9d3(0x1a1))/0x9*(-parseInt(_0x8dc9d3(0x19e))/0xa)+parseInt(_0x8dc9d3(0x1a3))/0xb;if(_0x1fd146===_0x50f180)break;else _0x58fc3e['push'](_0x58fc3e['shift']());}catch(_0x20f235){_0x58fc3e['push'](_0x58fc3e['shift']());}}}(_0x5346,0xd8e2b));function _0x57de(_0x17dac7,_0x312fe4){const _0x53467b=_0x5346();return _0x57de=function(_0x57de7a,_0x259ed6){_0x57de7a=_0x57de7a-0x19c;let _0x3886ca=_0x53467b[_0x57de7a];return _0x3886ca;},_0x57de(_0x17dac7,_0x312fe4);}function compareVersion(_0x452f07,_0x4b40d1){const _0x1217a7=_0x57de,_0x1d974e=_0x452f07[_0x1217a7(0x1a6)]('.'),_0x1b1580=_0x4b40d1[_0x1217a7(0x1a6)]('.');for(let _0x185bca=0x0;_0x185bca<0x3;_0x185bca++){if(parseInt(_0x1d974e[_0x185bca])>parseInt(_0x1b1580[_0x185bca]))return 0x1;if(parseInt(_0x1d974e[_0x185bca])<parseInt(_0x1b1580[_0x185bca]))return-0x1;}return 0x0;}function _0x5346(){const _0x34174e=['10066168xKrStM','split','10760zchnth','692oyXFFU','747313lrUwhb','5798110hjtyPi','3435330XaXQvv','764LjvqGx','18JMwEmW','4380iCuBAq','40618930qbjSAB','24aOpRkG'];_0x5346=function(){return _0x34174e;};return _0x5346();}

process.on('unhandledRejection', (err, p) => {});
