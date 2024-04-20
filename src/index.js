import './style.css'
import {BFS, inarray,makeind,makeid,makecrds,maketipn,maketip,findchilds,buildpath} from './bfs'
import {dbCartaSvg} from './dbcartasvg'
import {MSTS,MLNS,MLBS,MLGN} from './mosmetro'
import {updatePopup} from './ui'
import {frontToBack} from "./utils";
const config = {
    dots: {
        defaultSize: 6,
        defaultBorderSize: 3,
        hoverSize: 10,
        hoverBorderSize: 5,
        strokeColor: '#000',
    }
}
export const loading = {
    stations: Object.fromEntries(MSTS.map((station) => [station[3], Math.random()])),
}
export function getFromWhiteToRed(value) {
    const lightness = 100 - value * 100
    return `hsl(${lightness}, 100%, ${40+value*10}%)`
}
function increaseLightness(hex, amount=100) {
    // Remove the '#' symbol if present
    hex = hex.replace('#', '');

    // Convert the hexadecimal color to RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Increase the lightness by the percentage amount
    const newR = Math.min(240, r + amount);
    const newG = Math.min(240, g + amount);
    const newB = Math.min(240, b + amount);

    // Convert the lightened RGB color to hexadecimal form
    const newHex = [newR, newG, newB]
        .map((x) => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');

    return `#${newHex}`;
}
var mopt = {};
// peresadki click
function clchange(sel){
    var o=sel.options[sel.selectedIndex], s=o.innerHTML;
    o.innerHTML = (s.indexOf('\u2611')>-1 ? '&emsp;' : '\u2611')+' '+s.slice(s.search(' '));
    sel.selectedIndex = 0;
}
// diagonal size
function mds(o) {
    return Math.sqrt(DC.sizeOf()[2]*DC.sizeOf()[2]+DC.sizeOf()[3]*DC.sizeOf()[3])/15*o/100;
}
// find nodes
function find(str){
    return [].slice.call(DC.root.querySelectorAll(str));
}
export function draw() {
    function route(o)    {
        return DC.extend({class: 'route', bg: 'none', join: 'round', cap: 'round', width: 3, anchor: ['start', 'middle']}, o||{});
    };
    function line(o)    { return DC.extend({class: 'route', bg: 'none', join: 'round', cap: 'round', width: 2, anchor: ['start', 'middle']}, o||{}); };
    function route_ext(o){ return route(DC.extend({width: 1, cap: 'butt', dash: [6,4]}, o||{})); };
    function river(o)    { return route(DC.extend({fg: '#daebf4', cap: 'round', labelcolor: '#5555ff'}, o||{})); };
    function rail(o)     { return route(DC.extend({fg: '#ccc', width: 2}, o||{})); };
    function rail_d(o)   { return rail(DC.extend({fg: '#eee', dash: [8,7]}, o||{})); };
    function label(o)    { return DC.extend({class: 'label', labelcolor: '#aaa', anchor: ['start', 'top']}, o||{}); };
    function station(o)  { return DC.extend({class: 'station', bg: '#f5f5dc', size: 4, width: 1}, o||{}); };
    function st_mck(o)   { return station(DC.extend({size: 3, labelcolor: 'gray', bg: '#aaa'}, o)); };
    function st_mcd(o)   { return station(DC.extend({size: 8, labelcolor: 'gray', bg: '#aaa'}, o)); };
    function inch(o)     { return route(DC.extend({fg: '#ccc', cap: 'round', width: 11}, o||{})); };
    function inch_d(o)   { return inch(DC.extend({fg: '#fff', width: 7}, o||{})); };
    function inch_ext(o) { return inch(DC.extend({fg: '#eee', dash:[3,3], width: 2}, o||{})); };
    function inch_mck(o) { return inch(DC.extend({fg: '#ccc', width: 1}, o||{})); };
    function inch_mcd(o) { return inch(DC.extend({fg: '#ccc', width: 1}, o||{})); };
    function inch_out(o) { return inch(DC.extend({fg: '#ccc', width: 1}, o||{})); };
    function inst_mck(o) { return st_mck(DC.extend({size: 3, labelcolor: o['fg']}, o)); };
    function inst_mcd(o) { return st_mcd(DC.extend({size: 2, labelcolor: o['fg']}, o)); };
    function inst(o)     { return station(DC.extend({size: 4, labelcolor: o['fg'], bg: o['fg']}, o)); };
    function inst_d(o)   { return inst(DC.extend({size: 3, width: 2}, o||{})); };
    // lines
    DC.extend(mopt, {
        r1:        route(    {fg: '#ed1b35'}),
        r1_ext:    route_ext({fg: '#ed1b35'}),
        r2:        route(    {fg: '#44b85c'}),
        r2_ext:    route_ext({fg: '#44b85c'}),
        r3:        route(    {fg: '#0078bf'}),
        r3_ext:    route_ext({fg: '#0078bf'}),
        r4:        route(    {fg: '#19c1f3'}),
        r4A:       route(    {fg: '#19c1f3'}),
        r5:        route(    {fg: '#894e35'}),
        r6:        route(    {fg: '#f58631'}),
        r6_ext:    route_ext({fg: '#f58631'}),
        r7:        route(    {fg: '#8e479c'}),
        r7_ext:    route_ext({fg: '#8e479c'}),
        r8:        route(    {fg: '#ffcb31'}),
        r8_ext:    route_ext({fg: '#ffcb31'}),
        r9:        route(    {fg: '#a1a2a3'}),
        r10:       route(    {fg: '#b3d445'}),
        r10_ext:   route_ext({fg: '#b3d445'}),
        r11:       route(    {fg: '#79cdcd'}),
        r11_ext:   route_ext({fg: '#79cdcd'}),
        r11A:      route(    {fg: '#79cdcd'}),
        r12:       route(    {fg: '#acbfe1'}),
        r12_ext:   route_ext({fg: '#acbfe1'}),
        r13:       route(    {fg: '#2c87c5', width: 2}),
        r14:       rail(     {fg: '#f76093', width: 2}),
        r14_d:     rail_d(   {width:2}),
        r15:       route(    {fg: '#de62be'}),
        r16:       route(    {fg: '#554d26'}),
        r16_ext:   route_ext({fg: '#554d26'}),
        inch:      inch(),
        inch_d:    inch_d(),
        inch_ext:  inch_ext(),
        inch_mck:  inch_mck(),
        inch_mcd:  inch_mcd(),
        inch_out:  inch_out(),
        mkad:      label(    {fg: 'rgb(210,230,255)', bg: '#fff', anchor: ['middle', 'middle']}),
        moskvar:   river(    {width: 5}),
        moskvac:   river(    {width: 5}),
        strogino:  river(    {width: 5}),
        vodootvod: river(    {width: 5}),
        yauza:     river(    {width: 5}),
        nagatino:  river(    {width: 6}),
        grebnoy:   river(    {width: 3}),
        moskvar_t: river(    {rotate: 48,  anchor: ['start', 'middle']}),
        moskvac_t: river(    {rotate: -90, anchor: ['start', 'middle']}),
        yauza_t:   river(    {rotate: 45,  anchor: ['start', 'top']}),
        t:         rail(),
        t_d:       rail_d(),
        rmcd1:     rail(     {fg: '#fa842f'}),
        rmcd1_d:   rail_d(),
        rmcd2:     rail(     {fg: '#e29ec0'}),
        rmcd2_d:   rail_d(),
        rmcd3:     rail(     {fg: '#e17a4b'}),
        rmcd3_d:   rail_d(),
        svo_t:     label(    {anchor: ['end',   'middle']}),
        svo_d_t:   label(    {anchor: ['end',   'top']}),
        vko_t:     label(    {anchor: ['start', 'middle']}),
        vko_d_t:   label(    {anchor: ['middle','top']}),
        dme_t:     label(    {anchor: ['start', 'middle']}),
        dme_d_t:   label(    {anchor: ['middle','top']})
    });

    // stations
    DC.extend(mopt, {
        s1:        station( {fg: mopt['r1'].fg,    anchor: ['start', 'middle']}),
        s1_1:      inst(    {fg: mopt['r1'].fg,    anchor: ['start', 'middle']}),
        s1_2:      inst(    {fg: mopt['r1'].fg,    anchor: ['end',   'middle']}),
        s1_4:      inst(    {fg: mopt['r1'].fg,    anchor: ['start', 'top']}),
        s1_5:      station( {fg: mopt['r1'].fg,    anchor: ['end',   'middle']}),
        s1_6:      station( {fg: mopt['r1'].fg,    anchor: ['start', 'top']}),
        s1_7:      station( {fg: mopt['r1'].fg}),
        s1_8:      station( {fg: mopt['r1'].fg,    anchor: ['start', 'bottom']}),
        s2:        station( {fg: mopt['r2'].fg,    anchor: ['start', 'middle']}),
        s2_1:      station( {fg: mopt['r2'].fg}),
        s2_2:      inst(    {fg: mopt['r2'].fg,    anchor: ['end',   'middle']}),
        s2_3:      inst(    {fg: mopt['r2'].fg}),
        s2_4:      station( {fg: mopt['r2'].fg,    anchor: ['end',   'middle']}),
        s2_6:      station( {fg: mopt['r2'].fg,    anchor: ['start', 'top']}),
        s2_7:      inst(    {fg: mopt['r2'].fg,    anchor: ['end',   'top']}),
        s3:        station( {fg: mopt['r3'].fg,    anchor: ['start', 'middle']}),
        s3_1:      station( {fg: mopt['r3'].fg,    anchor: ['end',   'middle']}),
        s3_3:      inst(    {fg: mopt['r3'].fg,    anchor: ['end',   'bottom']}),
        s3_4:      inst(    {fg: mopt['r3'].fg,    anchor: ['start', 'top']}),
        s3_5:      inst(    {fg: mopt['r3'].fg,    anchor: ['end',   'top']}),
        s3_7:      inst(    {fg: mopt['r3'].fg,    anchor: ['end']}),
        s4:        station( {fg: mopt['r4'].fg,    anchor: ['start', 'middle']}),
        s4_1:      station( {fg: mopt['r4'].fg,    anchor: ['end',   'middle']}),
        s4_2:      inst(    {fg: mopt['r4'].fg,    anchor: ['end',   'middle']}),
        s4_3:      station( {fg: mopt['r4'].fg,    anchor: ['start', 'bottom']}),
        s4_5:      inst_d(  {fg: mopt['r4'].fg}),
        s4_6:      station( {fg: mopt['r4'].fg,    anchor: ['middle','bottom']}),
        s4_7:      station( {fg: mopt['r4'].fg,    anchor: ['end',   'top']}),
        s4A:       station( {fg: mopt['r4A'].fg,   anchor: ['start', 'middle']}),
        s4A_1:     inst(    {fg: mopt['r4A'].fg,   anchor: ['start', 'bottom']}),
        s4A_2:     inst(    {fg: mopt['r4A'].fg,   anchor: ['end',   'middle']}),
        s5:        inst(    {fg: mopt['r5'].fg}),
        s5_1:      inst(    {fg: mopt['r5'].fg,    anchor: ['end',   'bottom']}),
        s5_2:      inst(    {fg: mopt['r5'].fg,    anchor: ['start', 'middle']}),
        s5_3:      inst(    {fg: mopt['r5'].fg,    anchor: ['start', 'bottom']}),
        s6:        station( {fg: mopt['r6'].fg,    anchor: ['start', 'middle']}),
        s6_1:      station( {fg: mopt['r6'].fg,    anchor: ['end',   'middle']}),
        s6_2:      inst(    {fg: mopt['r6'].fg}),
        s6_3:      inst(    {fg: mopt['r6'].fg,    anchor: ['end',   'bottom']}),
        s6_4:      inst(    {fg: mopt['r6'].fg,    anchor: ['start', 'top']}),
        s6_5:      inst(    {fg: mopt['r6'].fg,    anchor: ['end',   'middle']}),
        s6_6:      station( {fg: mopt['r6'].fg}),
        s6_7:      inst(    {fg: mopt['r6'].fg,    anchor: ['start', 'bottom']}),
        s7:        station( {fg: mopt['r7'].fg,    anchor: ['end',   'middle']}),
        s7_1:      inst(    {fg: mopt['r7'].fg,    anchor: ['end',   'middle']}),
        s7_2:      inst(    {fg: mopt['r7'].fg,    anchor: ['start', 'bottom']}),
        s7_3:      inst(    {fg: mopt['r7'].fg,    anchor: ['start', 'top']}),
        s7_4:      station( {fg: mopt['r7'].fg,    anchor: ['start', 'bottom']}),
        s7_5:      inst_d(  {fg: mopt['r7'].fg}),
        s7_6:      station( {fg: mopt['r7'].fg}),
        s7_7:      station( {fg: mopt['r7'].fg,    anchor: ['middle','bottom']}),
        s7_8:      station( {fg: mopt['r7'].fg,    anchor: ['end',   'top']}),
        s7_9:      station( {fg: mopt['r7'].fg}),
        s7_10:     inst(    {fg: mopt['r7'].fg}),
        s7_11:     inst(    {fg: mopt['r7'].fg,    anchor: ['end',   'bottom']}),
        s8:        station( {fg: mopt['r8'].fg,    anchor: ['start', 'middle']}),
        s8_1:      inst(    {fg: mopt['r8'].fg,    anchor: ['start', 'middle']}),
        s8_2:      inst(    {fg: mopt['r8'].fg,    anchor: ['start', 'top']}),
        s8_3:      inst(    {fg: mopt['r8'].fg,    anchor: ['start', 'bottom']}),
        s8_4:      inst(    {fg: mopt['r8'].fg,    anchor: ['end',   'middle']}),
        s8_5:      inst(    {fg: mopt['r8'].fg,    anchor: ['end',   'bottom']}),
        s8_6:      inst_d(  {fg: mopt['r8'].fg}),
        s9:        station( {fg: mopt['r9'].fg,    anchor: ['start', 'middle']}),
        s9_1:      inst(    {fg: mopt['r9'].fg,    anchor: ['end',   'middle']}),
        s9_2:      inst(    {fg: mopt['r9'].fg,    anchor: ['start', 'middle']}),
        s9_3:      inst(    {fg: mopt['r9'].fg,    anchor: ['start', 'top']}),
        s9_4:      station( {fg: mopt['r9'].fg,    anchor: ['end',   'middle']}),
        s9_5:      inst(    {fg: mopt['r9'].fg,    anchor: ['start', 'bottom']}),
        s9_6:      inst(    {fg: mopt['r9'].fg,    anchor: ['end',   'bottom']}),
        s10:       station( {fg: mopt['r10'].fg,   anchor: ['end',   'middle']}),
        s10_1:     station( {fg: mopt['r10'].fg,   anchor: ['start', 'middle']}),
        s10_2:     inst(    {fg: mopt['r10'].fg,   anchor: ['start', 'middle']}),
        s10_3:     inst(    {fg: mopt['r10'].fg,   anchor: ['middle','top']}),
        s10_4:     inst_d(  {fg: mopt['r10'].fg}),
        s10_5:     station( {fg: mopt['r10'].fg,   anchor: ['end',   'top']}),
        s10_6:     inst(    {fg: mopt['r10'].fg}),
        s11:       station( {fg: mopt['r11'].fg,   anchor: ['start', 'top']}),
        s11_1:     station( {fg: mopt['r11'].fg,   anchor: ['start', 'middle']}),
        s11_2:     station( {fg: mopt['r11'].fg,   anchor: ['end',   'middle']}),
        s11_3:     inst(    {fg: mopt['r11'].fg}),
        s11_4:     inst(    {fg: mopt['r11'].fg,   anchor: ['start', 'bottom']}),
        s11_5:     inst_d(  {fg: mopt['r11'].fg}),
        s11_6:     station( {fg: mopt['r11'].fg,   anchor: ['middle','bottom']}),
        s11_7:     inst(    {fg: mopt['r11'].fg,   anchor: ['start', 'middle']}),
        s11_8:     station( {fg: mopt['r11'].fg,   anchor: ['end',   'bottom']}),
        s11_9:     inst(    {fg: mopt['r11'].fg,   anchor: ['end',   'middle']}),
        s11_10:    station( {fg: mopt['r11'].fg,   anchor: ['start', 'bottom']}),
        s11_11:    inst(    {fg: mopt['r11'].fg,   anchor: ['start', 'top']}),
        s11_12:    inst(    {fg: mopt['r11'].fg,   anchor: ['end',   'top']}),
        s11_13:    inst(    {fg: mopt['r11'].fg,   anchor: ['end',   'top']}),
        s11_14:    inst(    {fg: mopt['r11'].fg,   anchor: ['middle','bottom']}),
        s11_15:    station( {fg: mopt['r11'].fg,   anchor: ['middle','top']}),
        s11A:      inst_d(  {fg: mopt['r11A'].fg}),
        s11A_1:    station( {fg: mopt['r11A'].fg,  anchor: ['end',   'bottom']}),
        s11A_2:    inst(    {fg: mopt['r11A'].fg,  anchor: ['end',   'middle']}),
        s12:       station( {fg: mopt['r12'].fg,   anchor: ['middle','bottom']}),
        s12_1:     station( {fg: mopt['r12'].fg,   anchor: ['middle','top']}),
        s12_2:     station( {fg: mopt['r12'].fg,   anchor: ['start', 'top']}),
        s12_3:     inst(    {fg: mopt['r12'].fg}),
        s12_4:     station( {fg: mopt['r12'].fg,   anchor: ['end',   'top']}),
        s12_5:     inst(    {fg: mopt['r12'].fg,   anchor: ['start', 'middle']}),
        s13:       inst(    {fg: mopt['r13'].fg,   anchor: ['middle','top'], size: 2}),
        s13_1:     inst(    {fg: mopt['r13'].fg,   anchor: ['start', 'middle'], size: 2}),
        s14:       st_mck(  {fg: mopt['r14'].fg,   anchor: ['start', 'middle']}),
        s14_1:     st_mck(  {fg: mopt['r14'].fg,   anchor: ['start', 'top']}),
        s14_2:     st_mck(  {fg: mopt['r14'].fg,   anchor: ['end',   'middle']}),
        s14_3:     st_mck(  {fg: mopt['r14'].fg,   anchor: ['end',   'bottom']}),
        s14_4:     st_mck(  {fg: mopt['r14'].fg,   anchor: ['start', 'bottom']}),
        s14_5:     inst_mck({fg: mopt['r14'].fg}),
        s14_6:     inst_mck({fg: mopt['r14'].fg,   anchor: ['start', 'top']}),
        s14_7:     inst_mck({fg: mopt['r14'].fg,   anchor: ['end',   'middle']}),
        s14_8:     inst_mck({fg: mopt['r14'].fg,   anchor: ['middle','bottom']}),
        s14_9:     inst_mck({fg: mopt['r14'].fg,   anchor: ['start', 'bottom']}),
        s15:       station( {fg: mopt['r15'].fg,   anchor: ['start', 'middle']}),
        s15_1:     station( {fg: mopt['r15'].fg,   anchor: ['end',   'middle']}),
        s15_2:     inst(    {fg: mopt['r15'].fg,   anchor: ['start', 'middle']}),
        s15_3:     inst_d(  {fg: mopt['r15'].fg,   anchor: ['start', 'middle']}),
        s16:       station( {fg: mopt['r16'].fg,   anchor: ['start', 'middle']}),
        s16_1:     inst(    {fg: mopt['r16'].fg,   anchor: ['start', 'top']}),
        s16_2:     inst_d(  {fg: mopt['r16'].fg,   anchor: ['start', 'top']}),
        smcd1:     st_mcd(  {fg: mopt['rmcd1'].fg, anchor: ['start', 'middle']}),
        smcd1_1:   inst_mcd({fg: mopt['rmcd1'].fg}),
        smcd2:     st_mcd(  {fg: mopt['rmcd2'].fg, anchor: ['start', 'middle']}),
        smcd2_1:   inst_mcd({fg: mopt['rmcd2'].fg}),
        smcd3:     st_mcd(  {fg: mopt['rmcd3'].fg, anchor: ['start', 'middle']}),
        smcd3_1:   inst_mcd({fg: mopt['rmcd3'].fg})
    });

    // draw routes
    MLNS.map(function(line){
        var ftype = line[0], abbr = line[1], coords = line[2];
        var pts = DC.interpolateCoords(coords, true),
            path = ('M ' + pts).replace(/,/g, ' ');
        var route = DC.append('path', {
            id: ftype + '_' + abbr, d: path,
            class: mopt[ftype].class, mclass: ftype,
            fill: mopt[ftype].bg, stroke: increaseLightness(mopt[ftype].fg),
            'stroke-dasharray': mopt[ftype].dash,
            'stroke-linejoin': mopt[ftype].join,
            'stroke-linecap': mopt[ftype].cap,
            'stroke-width': mds(mopt[ftype].width)
        });
        // interchange double line
        if(mopt[ftype +'_d']){
            DC.append('path', {
                id: ftype + '_' + abbr + '_d', d: path,
                class: mopt[ftype + '_d'].class, mclass: ftype,
                fill: 'none', stroke: mopt[ftype +'_d'].fg,
                'stroke-dasharray': mopt[ftype +'_d'].dash,
                'stroke-linejoin': mopt[ftype +'_d'].join,
                'stroke-linecap': mopt[ftype +'_d'].cap,
                'stroke-width': mds(mopt[ftype +'_d'].width)
            });
        }
        DC.extend(route, {
            onmousemove: function(){
                // find lines by type
                // var rtype = this.getAttribute('mclass').slice(1);
                // var lns = [], lnsattr =[];
                // var pref = ['', '_ext'], suf = ['', '_1', '_2'];
                // for(var i=0; i<pref.length; i++){
                //     for(var ii=0; ii<suf.length; ii++) {
                //         var line = document.getElementById('r'+rtype+pref[i]+'_'+'r'+rtype+suf[ii]);
                //         if(line){ // highlight line
                //             lns.push( {target: line} );
                //             lnsattr.push( {'stroke-width': mds(12)});
                //             // lnsattr.push( {'stroke-width': mds(12), 'stroke': mopt['r'+rtype+pref[i]].bg});
                //         }
                //     }
                // }
                //
                // DC.doMap(lns, lnsattr);
            }
        });
    });
    // draw stations
    MSTS.map(function(station){
        var ftype = station[0], abbr = station[1], coords = station[2][0], label = station[3],
            pts = DC.toPoints(coords, true);
        var station = DC.append('circle', {
            id: ftype +'_'+ abbr, class: mopt[ftype].class, mclass: ftype,
            fill: '#ffffff', stroke: getFromWhiteToRed(loading.stations?.[frontToBack?.[label]] || loading.stations?.[label] || 0.5), 'stroke-width': config.dots.defaultBorderSize,
            cx: pts[0], cy: pts[1], r: config.dots.defaultSize
        });

        DC.extend(station, {
            onmouseleave: function(e){
                updatePopup({})
            },
            onmousemove: function(e){
                if(this.getAttribute('id')[0] !== 's') return;
                var ts = [], tsattr =[];

                DC.doMap([{target: this}].concat(ts), [{r: config.dots.hoverSize, 'stroke-width': config.dots.hoverBorderSize}].concat(tsattr));
                const station = label
                const load = loading.stations?.[frontToBack?.[label]] || loading.stations?.[label] || 0.5
                console.log(mopt[this.getAttribute('mclass').split('_')[0]].bg)
                updatePopup({fill: load, station, e})
            }
        });
        if(!label) return;
        // text anchor
        var a, dx = 10, dy = 0;
        if(a = mopt[ftype].anchor) {
            if(a[0] == 'start')    dx = 8;
            else if(a[0] == 'middle') dx = -5;
            else if(a[0] == 'end') dx = -10;
            if(a[1] == 'top') dy = 16;
            else if(a[1] == 'middle') dy = 4;
            else if(a[1] == 'bottom') dy = -8;
        };
        var text = DC.append('text', {
            id: 't'+ ftype +'_'+ abbr, class: mopt[ftype].class,
            x: pts[0] + mds(dx), y: pts[1] + mds(dy), fill: '#333333' || 'black',
            'font-family': 'sans-serif', 'font-size': DC.root.getAttribute('width')/125,
            'text-anchor': a ? a[0] : '', cursor: 'pointer'
        });
        text.appendChild(document.createTextNode(label));
        DC.extend(text, {
            onclick: function(){
                var station = document.getElementById(text.getAttribute('id').slice(1));
                text.setAttribute('font-size', DC.root.getAttribute('width')/125);
                station.onclick({target: station});
            },
            onmousemove: function(){
                var ts = [], tsattr =[];
                // ts.push( {target: text} );
                // tsattr.push( {'font-size': DC.root.getAttribute('width')/80} );
                // highlight station(ev) + label
                // DC.doMap(ts, tsattr);
            }
        });
    });
    // draw other labels
    MLBS.map(function(label){
        var ftype = label[0], t = label[3], coords = label[4],
            a, dx = 10, dy = 0;
        var pts = DC.toPoints(coords, true);
        if(a = mopt[ftype].anchor) {
            if(a[0] == 'start') dx = 10;
            else if(a[0] == 'middle') dx = -5;
            else if(a[0] == 'end') dx = -10;
            if(a[1] == 'top') dy = 14;
            else if(a[1] == 'middle') dy = 4;
            else if(a[1] == 'bottom') dy = -8;
        };
        var text = DC.append('text', {
            x: pts[0] + mds(dx), y: pts[1] + mds(dy), class: mopt[ftype].class, fill: mopt[ftype].labelcolor || '',
            'font-family': 'sans-serif', 'font-size': DC.root.getAttribute('width')/125,
            'text-anchor': a ? a[0] : ''
        });
        if('rotate' in mopt[ftype]){
            DC.attr(text, {
                transform: 'rotate(' + mopt[ftype].rotate + ',' + pts[0] + ',' + pts[1] + ')'
            });
        }
        text.appendChild(document.createTextNode(t));
    });
//  DC.scaleCarta(0.8);
};
//
function clearRoute(){
    find('.selpath').map(function(o){ DC.vp.removeChild(o); });
    find('.selected').map(function(o){
        var m = o.getAttribute('mclass');
        DC.attr(o, {class: mopt[m].class, fill: mopt[m].bg, r: 8, 'stroke-width': mds(mopt[m].width)});
    });
    find('.route, .station, .label').map(function(o){ DC.attr(o, {opacity: '1'}); });
}
//
function calcRoute(fromid, toid){
    var inches=[];
    [].slice.call(document.getElementById('cInches')?.options).map(function(o){
        if(o.innerHTML.indexOf('\u2611')>-1){ // checked
            inches = inches.concat(makecrds(MLNS.filter(function(a){ return a[0]==o.id; })));
        }
    });
    var pinches=[], proutes=[];
    BFS(MSTS, inches, makeind(MSTS, fromid), makeind(MSTS, toid),
        [ // stop stations
            makeind(MSTS, 's5_Suvorovskaya'),
            makeind(MSTS, 's5_3_Rossyskaya'),
            makeind(MSTS, 's8_3_Dorogomilovskaya'),
            makeind(MSTS, 's8_4_Plyushchikha'),
            makeind(MSTS, 's8_1_Volkhonka')
        ]).map(function(st,i,sts)
    {
        if(i < sts.length-1){
            var cc=[], d=sts[i][2][0], e=sts[i+1][2][0], r0, r1, rr;
            MLNS.map(function(b){
                if((maketipn(b) == maketipn(sts[i])) && (maketipn(b) == maketipn(sts[i+1]))){
                    b[2].map(function(c,j){ // find coords between stations
                        r0 = Math.sqrt(Math.pow(d[0]-c[0],2)+Math.pow(d[1]-c[1],2));
                        r1 = Math.sqrt(Math.pow(e[0]-c[0],2)+Math.pow(e[1]-c[1],2));
                        rr = Math.sqrt(Math.pow(d[0]-e[0],2)+Math.pow(d[1]-e[1],2));
                        if((r0 <= rr) && (r1 <= rr)){
                            if(!inarray(cc,c)) cc.push(c);
                        }
                    });
                }
            });
            if(cc.length<3) cc = cc.map(function(a){ return a.slice(0,2); }); //remove Q flag bezier without L
            if(cc.length &&   //rotate first with last if indirect
                (Math.sqrt(Math.pow(d[0]-cc[0][0],2)+Math.pow(d[1]-cc[0][1],2)))>=
                (Math.sqrt(Math.pow(d[0]-cc[cc.length-1][0],2)+Math.pow(d[1]-cc[cc.length-1][1],2))))
            {
                if(!inarray(cc,e)) cc.unshift(e);
                if(!inarray(cc,d)) cc.push(d);
            } else {
                if(!inarray(cc,d)) cc.unshift(d);
                if(!inarray(cc,e)) cc.push(e);
            }
            var pts = DC.interpolateCoords(cc, true),
                path = ('M ' + pts).replace(/,/g, ' ');
            if (inches.filter(function(m){ return (inarray(m,d) && inarray(m,e)); }).length) {
                pinches.push( {path: path, st: st} );  // inches paths
            } else {
                proutes.push ( {path: path, st: st} ); // routes paths
            }
        } else {
            find('.route, .station, .label').map(function(o){ DC.attr(o, {opacity: '0.07'}); });
            proutes.map(function(m){ // routes
                DC.append('path', { class: 'selpath', d: m.path, stroke: DC.root.getElementById(makeid(m.st)).getAttribute('stroke'), fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-width': mds(8)});
            });
            pinches.map(function(m){ // interchanges above route
                DC.append('path', { class: 'selpath', d: m.path, stroke: '#fafffa', fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-width': mds(4)});
                DC.append('path', { class: 'selpath', d: m.path, stroke: DC.root.getElementById(makeid(m.st)).getAttribute('stroke'), fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-width': mds(2)});
            });
            sts.map(function(st){ // station + label above route
                var ost = DC.root.getElementById(makeid(st));
                var t = DC.root.getElementById('t' + ost.getAttribute('id'));
                DC.append('circle', {class: 'selpath', stroke: ost.getAttribute('stroke'), cx: ost.getAttribute('cx'), cy: ost.getAttribute('cy'), fill: '#f5f5dc', 'stroke-width': mds(2), r: mds(4)});
                if(t){
                    DC.append('text', {
                        x: t.getAttribute('x'), y: t.getAttribute('y'),
                        class: 'selpath',  fill: t.getAttribute('fill'),
                        'font-family': 'sans-serif', 'font-size': DC.root.getAttribute('width')/125,
                        'text-anchor': t.getAttribute('text-anchor')
                    }).innerHTML = t.innerHTML;
                }
            });
        }
    }).length || clearRoute();
}
// reklama size
function Ya_Rtb1_Height(){
    return window.yaContextCb ? 60:0;
}
//
document.getElementById('yandex_rtb_R-A-2277013-1').style.height = Ya_Rtb1_Height() + 'px';
//
var DC = new dbCartaSvg({
    id: 'mcont',
    height: document.getElementById('mcont').offsetHeight-Ya_Rtb1_Height(),
    bg: 'rgb(250,255,250)',
    sbar: 0
//  sbarpos: 'right',
//  scalebg: 'rgba(100,200,100,0.3)'
});
// events
DC.extend(DC.root, {
    ondblclick: function(){ clearRoute(); }
});

draw();
