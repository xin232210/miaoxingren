
(function () {
var scripts = [{"deps":{"./assets/scripts/AdBtn":9,"./assets/scripts/AdUtils":7,"./assets/scripts/AutoScale":31,"./assets/scripts/BattleGround2Ctrl":24,"./assets/scripts/Bullet2":8,"./assets/scripts/Butler":33,"./assets/scripts/Cloud":10,"./assets/scripts/ContentAdapter":15,"./assets/scripts/CustomSafeArea":11,"./assets/scripts/DieEff2":12,"./assets/scripts/EnemySpawner2":13,"./assets/scripts/GameConfig":14,"./assets/scripts/GameConst":17,"./assets/scripts/Gate2":19,"./assets/scripts/GuideManager":16,"./assets/scripts/JsonControl":18,"./assets/scripts/Num2":20,"./assets/scripts/PlayerData":21,"./assets/scripts/Pool":25,"./assets/scripts/PopupManager":22,"./assets/scripts/PowerInfo":23,"./assets/scripts/PrefabInfo":34,"./assets/scripts/RemoveWhenComplete":57,"./assets/scripts/RewardItem":27,"./assets/scripts/Role2":29,"./assets/scripts/RuntimeData":26,"./assets/scripts/SoundManager":32,"./assets/scripts/Subpub":28,"./assets/scripts/TAUtils":30,"./assets/scripts/Tool":52,"./assets/scripts/cleargamedata":55,"./assets/scripts/gamedatacleaner":35,"./assets/scripts/loading":36,"./assets/scripts/utils":37,"./assets/scripts/ActBuffPanel":2,"./assets/temp":1,"./assets/game/scripts/BuffItem":3,"./assets/game/scripts/Bullet":42,"./assets/game/scripts/ColliderProxy":38,"./assets/game/scripts/Enemy":39,"./assets/game/scripts/Enemy12":48,"./assets/game/scripts/EventCollider":40,"./assets/game/scripts/GameHub":41,"./assets/game/scripts/Hero":43,"./assets/game/scripts/Item":44,"./assets/game/scripts/ItemRoot":45,"./assets/game/scripts/Pos":47,"./assets/game/scripts/UIBackMainTip":51,"./assets/game/scripts/UIBuyBlock":46,"./assets/game/scripts/UIGameBuff":49,"./assets/game/scripts/UIGameEnd":53,"./assets/game/scripts/UIGameLv5Info":50,"./assets/game/scripts/UIGameMoney":54,"./assets/game/scripts/UIGamePause":69,"./assets/game/scripts/UIGameReborn":72,"./assets/game/scripts/UIGameStastics":75,"./assets/game/scripts/UIGameToolInfo":60,"./assets/game/scripts/UISpeed":58,"./assets/game/scripts/UIStashTip":56,"./assets/game/scripts/game":59,"./assets/game/scripts/game1":61,"./assets/game/scripts/Block":62,"./assets/game/scripts/BlockRoot":66,"./assets/game2/scripts/UIGame2End":4,"./assets/game2/scripts/UIGame2Set":64,"./assets/mainUI/scripts/EffectFly":5,"./assets/mainUI/scripts/LevelMap":80,"./assets/mainUI/scripts/LevelPlayer":63,"./assets/mainUI/scripts/MainControl":65,"./assets/mainUI/scripts/MainUI":68,"./assets/mainUI/scripts/RedControl":70,"./assets/mainUI/scripts/ShopBoxItem":71,"./assets/mainUI/scripts/ShopCoinItem":67,"./assets/mainUI/scripts/ShopDailyItem":110,"./assets/mainUI/scripts/SignItem":108,"./assets/mainUI/scripts/TaskItem":106,"./assets/mainUI/scripts/ToolCard":74,"./assets/mainUI/scripts/ToolLockCard":73,"./assets/mainUI/scripts/ToolSkillInfo":76,"./assets/mainUI/scripts/UIActLevel":77,"./assets/mainUI/scripts/UIActLevelInfo":78,"./assets/mainUI/scripts/UIAdBuy":89,"./assets/mainUI/scripts/UIAdGame2":81,"./assets/mainUI/scripts/UIFund":79,"./assets/mainUI/scripts/UIPowerBuy":83,"./assets/mainUI/scripts/UIPreGame":82,"./assets/mainUI/scripts/UIRankMode":84,"./assets/mainUI/scripts/UIReward":86,"./assets/mainUI/scripts/UISet":85,"./assets/mainUI/scripts/UIShare":90,"./assets/mainUI/scripts/UIShop":87,"./assets/mainUI/scripts/UIShopBoxBuy":88,"./assets/mainUI/scripts/UIShopBoxDetail":97,"./assets/mainUI/scripts/UIShopBoxLvUp":91,"./assets/mainUI/scripts/UIShopBoxReward":92,"./assets/mainUI/scripts/UIShopBoxTip":93,"./assets/mainUI/scripts/UIShopBuy":94,"./assets/mainUI/scripts/UISign":95,"./assets/mainUI/scripts/UITask":96,"./assets/mainUI/scripts/UITool":98,"./assets/mainUI/scripts/UIToolInfo":99,"./assets/mainUI/scripts/UIToolSkin":101,"./assets/mainUI/scripts/WxClubBtn":104,"./assets/mainUI/scripts/ActLevelItem":100,"./assets/mainUI/scripts/Dragable":103,"./assets/rank/scripts/UIRankList":6,"./assets/rank/scripts/UIRankReward":102,"./assets/rank/scripts/UIRankTip":107,"./assets/rank/scripts/UIRankUpEffect":105,"./assets/rank/scripts/WxUserInfoBtn":111,"./assets/rank/scripts/UIAuthorize":109,"./assets/rank/scripts/UIRankEnd":112},"path":"preview-scripts/__qc_index__.js"},{"deps":{},"path":"preview-scripts/assets/temp.js"},{"deps":{},"path":"preview-scripts/assets/scripts/ActBuffPanel.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/BuffItem.js"},{"deps":{},"path":"preview-scripts/assets/game2/scripts/UIGame2End.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/EffectFly.js"},{"deps":{},"path":"preview-scripts/assets/rank/scripts/UIRankList.js"},{"deps":{},"path":"preview-scripts/assets/scripts/AdUtils.js"},{"deps":{"./SoundManager":32,"./Pool":25,"./BattleGround2Ctrl":24,"./Gate2":19,"./Role2":29},"path":"preview-scripts/assets/scripts/Bullet2.js"},{"deps":{},"path":"preview-scripts/assets/scripts/AdBtn.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Cloud.js"},{"deps":{},"path":"preview-scripts/assets/scripts/CustomSafeArea.js"},{"deps":{"./Tool":52,"./Pool":25},"path":"preview-scripts/assets/scripts/DieEff2.js"},{"deps":{"./BattleGround2Ctrl":24,"./Role2":29},"path":"preview-scripts/assets/scripts/EnemySpawner2.js"},{"deps":{},"path":"preview-scripts/assets/scripts/GameConfig.js"},{"deps":{},"path":"preview-scripts/assets/scripts/ContentAdapter.js"},{"deps":{},"path":"preview-scripts/assets/scripts/GuideManager.js"},{"deps":{},"path":"preview-scripts/assets/scripts/GameConst.js"},{"deps":{},"path":"preview-scripts/assets/scripts/JsonControl.js"},{"deps":{"./Pool":25,"./BattleGround2Ctrl":24,"./Role2":29},"path":"preview-scripts/assets/scripts/Gate2.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Num2.js"},{"deps":{},"path":"preview-scripts/assets/scripts/PlayerData.js"},{"deps":{"./PrefabInfo":34},"path":"preview-scripts/assets/scripts/PopupManager.js"},{"deps":{},"path":"preview-scripts/assets/scripts/PowerInfo.js"},{"deps":{"./SoundManager":32,"./Tool":52,"./Pool":25,"./Bullet2":8,"./DieEff2":12,"./Gate2":19,"./Num2":20,"./Role2":29},"path":"preview-scripts/assets/scripts/BattleGround2Ctrl.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Pool.js"},{"deps":{},"path":"preview-scripts/assets/scripts/RuntimeData.js"},{"deps":{},"path":"preview-scripts/assets/scripts/RewardItem.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Subpub.js"},{"deps":{"./SoundManager":32,"./Tool":52,"./Pool":25,"./BattleGround2Ctrl":24,"./EnemySpawner2":13,"./Num2":20},"path":"preview-scripts/assets/scripts/Role2.js"},{"deps":{},"path":"preview-scripts/assets/scripts/TAUtils.js"},{"deps":{},"path":"preview-scripts/assets/scripts/AutoScale.js"},{"deps":{},"path":"preview-scripts/assets/scripts/SoundManager.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Butler.js"},{"deps":{},"path":"preview-scripts/assets/scripts/PrefabInfo.js"},{"deps":{},"path":"preview-scripts/assets/scripts/gamedatacleaner.js"},{"deps":{},"path":"preview-scripts/assets/scripts/loading.js"},{"deps":{},"path":"preview-scripts/assets/scripts/utils.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/ColliderProxy.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/Enemy.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/EventCollider.js"},{"deps":{"../../scripts/PrefabInfo":34},"path":"preview-scripts/assets/game/scripts/GameHub.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/Bullet.js"},{"deps":{"./Bullet":42},"path":"preview-scripts/assets/game/scripts/Hero.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/Item.js"},{"deps":{"../../scripts/PrefabInfo":34},"path":"preview-scripts/assets/game/scripts/ItemRoot.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIBuyBlock.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/Pos.js"},{"deps":{"./Enemy":39},"path":"preview-scripts/assets/game/scripts/Enemy12.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIGameBuff.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIGameLv5Info.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIBackMainTip.js"},{"deps":{"./Subpub":28},"path":"preview-scripts/assets/scripts/Tool.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIGameEnd.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIGameMoney.js"},{"deps":{},"path":"preview-scripts/assets/scripts/cleargamedata.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIStashTip.js"},{"deps":{},"path":"preview-scripts/assets/scripts/RemoveWhenComplete.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UISpeed.js"},{"deps":{"../../scripts/PrefabInfo":34},"path":"preview-scripts/assets/game/scripts/game.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIGameToolInfo.js"},{"deps":{"./BlockRoot":66,"./ItemRoot":45,"../../scripts/PrefabInfo":34},"path":"preview-scripts/assets/game/scripts/game1.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/Block.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/LevelPlayer.js"},{"deps":{},"path":"preview-scripts/assets/game2/scripts/UIGame2Set.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/MainControl.js"},{"deps":{"../../scripts/PrefabInfo":34,"./Block":62},"path":"preview-scripts/assets/game/scripts/BlockRoot.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/ShopCoinItem.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/MainUI.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIGamePause.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/RedControl.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/ShopBoxItem.js"},{"deps":{},"path":"preview-scripts/assets/game/scripts/UIGameReborn.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/ToolLockCard.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/ToolCard.js"},{"deps":{"../../scripts/PrefabInfo":34},"path":"preview-scripts/assets/game/scripts/UIGameStastics.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/ToolSkillInfo.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIActLevel.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIActLevelInfo.js"},{"deps":{"../../scripts/PrefabInfo":34},"path":"preview-scripts/assets/mainUI/scripts/UIFund.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/LevelMap.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIAdGame2.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIPreGame.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIPowerBuy.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIRankMode.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UISet.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIReward.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShop.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShopBoxBuy.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIAdBuy.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShare.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShopBoxLvUp.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShopBoxReward.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShopBoxTip.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShopBuy.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UISign.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UITask.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIShopBoxDetail.js"},{"deps":{"./ToolCard":74},"path":"preview-scripts/assets/mainUI/scripts/UITool.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIToolInfo.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/ActLevelItem.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/UIToolSkin.js"},{"deps":{},"path":"preview-scripts/assets/rank/scripts/UIRankReward.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/Dragable.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/WxClubBtn.js"},{"deps":{},"path":"preview-scripts/assets/rank/scripts/UIRankUpEffect.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/TaskItem.js"},{"deps":{},"path":"preview-scripts/assets/rank/scripts/UIRankTip.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/SignItem.js"},{"deps":{},"path":"preview-scripts/assets/rank/scripts/UIAuthorize.js"},{"deps":{},"path":"preview-scripts/assets/mainUI/scripts/ShopDailyItem.js"},{"deps":{},"path":"preview-scripts/assets/rank/scripts/WxUserInfoBtn.js"},{"deps":{},"path":"preview-scripts/assets/rank/scripts/UIRankEnd.js"}];
var entries = ["preview-scripts/__qc_index__.js"];
var bundleScript = 'preview-scripts/__qc_bundle__.js';

/**
 * Notice: This file can not use ES6 (for IE 11)
 */
var modules = {};
var name2path = {};

// Will generated by module.js plugin
// var scripts = ${scripts};
// var entries = ${entries};
// var bundleScript = ${bundleScript};

if (typeof global === 'undefined') {
    window.global = window;
}

var isJSB = typeof jsb !== 'undefined';

function getXMLHttpRequest () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

function downloadText(url, callback) {
    if (isJSB) {
        var result = jsb.fileUtils.getStringFromFile(url);
        callback(null, result);
        return;
    }

    var xhr = getXMLHttpRequest(),
        errInfo = 'Load text file failed: ' + url;
    xhr.open('GET', url, true);
    if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
                callback(null, xhr.responseText);
            }
            else {
                callback({status:xhr.status, errorMessage:errInfo + ', status: ' + xhr.status});
            }
        }
        else {
            callback({status:xhr.status, errorMessage:errInfo + '(wrong readyState)'});
        }
    };
    xhr.onerror = function(){
        callback({status:xhr.status, errorMessage:errInfo + '(error)'});
    };
    xhr.ontimeout = function(){
        callback({status:xhr.status, errorMessage:errInfo + '(time out)'});
    };
    xhr.send(null);
};

function loadScript (src, cb) {
    if (typeof require !== 'undefined') {
        require(src);
        return cb();
    }

    // var timer = 'load ' + src;
    // console.time(timer);

    var scriptElement = document.createElement('script');

    function done() {
        // console.timeEnd(timer);
        // deallocation immediate whatever
        scriptElement.remove();
    }

    scriptElement.onload = function () {
        done();
        cb();
    };
    scriptElement.onerror = function () {
        done();
        var error = 'Failed to load ' + src;
        console.error(error);
        cb(new Error(error));
    };
    scriptElement.setAttribute('type','text/javascript');
    scriptElement.setAttribute('charset', 'utf-8');
    scriptElement.setAttribute('src', src);

    document.head.appendChild(scriptElement);
}

function loadScripts (srcs, cb) {
    var n = srcs.length;

    srcs.forEach(function (src) {
        loadScript(src, function () {
            n--;
            if (n === 0) {
                cb();
            }
        });
    })
}

function formatPath (path) {
    let destPath = window.__quick_compile_project__.destPath;
    if (destPath) {
        let prefix = 'preview-scripts';
        if (destPath[destPath.length - 1] === '/') {
            prefix += '/';
        }
        path = path.replace(prefix, destPath);
    }
    return path;
}

window.__quick_compile_project__ = {
    destPath: '',

    registerModule: function (path, module) {
        path = formatPath(path);
        modules[path].module = module;
    },

    registerModuleFunc: function (path, func) {
        path = formatPath(path);
        modules[path].func = func;

        var sections = path.split('/');
        var name = sections[sections.length - 1];
        name = name.replace(/\.(?:js|ts|json)$/i, '');
        name2path[name] = path;
    },

    require: function (request, path) {
        var m, requestScript;

        path = formatPath(path);
        if (path) {
            m = modules[path];
            if (!m) {
                console.warn('Can not find module for path : ' + path);
                return null;
            }
        }

        if (m) {
            let depIndex = m.deps[request];
            // dependence script was excluded
            if (depIndex === -1) {
                return null;
            }
            else {
                requestScript = scripts[ m.deps[request] ];
            }
        }
        
        let requestPath = '';
        if (!requestScript) {
            // search from name2path when request is a dynamic module name
            if (/^[\w- .]*$/.test(request)) {
                requestPath = name2path[request];
            }

            if (!requestPath) {
                if (CC_JSB) {
                    return require(request);
                }
                else {
                    console.warn('Can not find deps [' + request + '] for path : ' + path);
                    return null;
                }
            }
        }
        else {
            requestPath = formatPath(requestScript.path);
        }

        let requestModule = modules[requestPath];
        if (!requestModule) {
            console.warn('Can not find request module for path : ' + requestPath);
            return null;
        }

        if (!requestModule.module && requestModule.func) {
            requestModule.func();
        }

        if (!requestModule.module) {
            console.warn('Can not find requestModule.module for path : ' + path);
            return null;
        }

        return requestModule.module.exports;
    },

    run: function () {
        entries.forEach(function (entry) {
            entry = formatPath(entry);
            var module = modules[entry];
            if (!module.module) {
                module.func();
            }
        });
    },

    load: function (cb) {
        var self = this;

        var srcs = scripts.map(function (script) {
            var path = formatPath(script.path);
            modules[path] = script;

            if (script.mtime) {
                path += ("?mtime=" + script.mtime);
            }
            return path;
        });

        console.time && console.time('load __quick_compile_project__');
        // jsb can not analysis sourcemap, so keep separate files.
        if (bundleScript && !isJSB) {
            downloadText(formatPath(bundleScript), function (err, bundleSource) {
                console.timeEnd && console.timeEnd('load __quick_compile_project__');
                if (err) {
                    console.error(err);
                    return;
                }

                let evalTime = 'eval __quick_compile_project__ : ' + srcs.length + ' files';
                console.time && console.time(evalTime);
                var sources = bundleSource.split('\n//------QC-SOURCE-SPLIT------\n');
                for (var i = 0; i < sources.length; i++) {
                    if (sources[i]) {
                        window.eval(sources[i]);
                        // not sure why new Function cannot set breakpoints precisely
                        // new Function(sources[i])()
                    }
                }
                self.run();
                console.timeEnd && console.timeEnd(evalTime);
                cb();
            })
        }
        else {
            loadScripts(srcs, function () {
                self.run();
                console.timeEnd && console.timeEnd('load __quick_compile_project__');
                cb();
            });
        }
    }
};

// Polyfill for IE 11
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
})();
    