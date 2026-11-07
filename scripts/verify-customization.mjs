import { chromium, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const base=process.env.MORI_SITE_URL || 'http://127.0.0.1:5180';
const out=new URL('../.impeccable/review/',import.meta.url);
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.MORI_BROWSER_EXECUTABLE?undefined:'chromium',executablePath:process.env.MORI_BROWSER_EXECUTABLE||undefined,headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
const errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
const shot=name=>page.screenshot({path:fileURLToPath(new URL('customization-'+name+'.png',out)),fullPage:true});
async function contrastOn(element, foreground = 'color') {
 const colors=await element.evaluate((el,key)=>{ const s=getComputedStyle(el); return [s[key],s.backgroundColor]; },foreground);
 const luminance=color=>{ const c=color.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4); return c[0]*.2126+c[1]*.7152+c[2]*.0722; };
 const [a,b]=colors.map(luminance);
 return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
async function open(name,mode){
 await page.goto(base+'/demo/?customization='+name+'-'+mode+'#/pages/preview/preview?component='+name+'&theme='+mode,{waitUntil:'networkidle'});
 await expect(page.locator('.preview-page')).toHaveCSS('background-color',mode==='dark'?'rgb(10, 10, 10)':'rgb(250, 250, 250)');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
}
try {
 for(const mode of ['light','dark']){
  await page.setViewportSize({width:mode==='light'?320:390,height:844});
  await open('button',mode);
  const solid=page.getByRole('button',{name:'自定义实心',exact:true}),outline=page.getByRole('button',{name:'自定义描边',exact:true});
  await expect(solid).toHaveCSS('background-color','rgb(67, 56, 202)');
  await expect(solid).toHaveCSS('border-color','rgb(49, 46, 129)');
  await expect(solid.locator('.mori-button__label')).toHaveCSS('color','rgb(255, 255, 255)');
  await expect(solid).toHaveCSS('height','36px');
  await outline.hover();await expect(outline).toHaveCSS('background-color','rgb(238, 242, 255)');
  await expect(outline.locator('.mori-button__label')).toHaveCSS('color','rgb(55, 48, 163)');
  await expect(page.getByRole('button',{name:'禁用按钮',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'加载中',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'品牌配色',exact:true}).tap();
  const main=page.getByRole('button',{name:'主要按钮',exact:true});
  await expect(main).toHaveCSS('background-color',mode==='dark'?'rgb(165, 180, 252)':'rgb(67, 56, 202)');
  await expect(solid).toHaveCSS('background-color','rgb(67, 56, 202)');
  await shot('button-brand-'+mode);
  await page.getByRole('button',{name:'默认配色',exact:true}).tap();
  await expect(main).toHaveCSS('background-color',mode==='dark'?'rgb(229, 229, 229)':'rgb(23, 23, 23)');
  checks.push(mode+': button overrides, hover, loading, 36px, live brand and reset');

  await open('input',mode);
  const custom=page.locator('.mori-field').filter({hasText:'自定义输入区域'});
  await expect(custom.locator('.mori-field__control')).toHaveCSS('background-color','rgb(238, 242, 255)');
  await expect(custom.locator('.mori-field__control')).toHaveCSS('border-color','rgb(165, 180, 252)');
  await custom.locator('input').fill('测试定制');
  await expect(custom.locator('input')).toHaveCSS('color','rgb(49, 46, 129)');
  await expect(custom.locator('.mori-field__control')).toHaveCSS('border-color','rgb(67, 56, 202)');
  await expect(custom.locator('.mori-field__control')).toHaveCSS('border-width','1px');
  await custom.getByRole('button',{name:'清空输入'}).tap();
  await expect(custom.locator('input')).toHaveValue('');
  await page.getByRole('button',{name:'品牌配色',exact:true}).tap();
  await expect(page.locator('.mori-field__label').first()).toHaveCSS('color',mode==='dark'?'rgb(224, 231, 255)':'rgb(23, 37, 84)');
  const error=page.locator('.mori-field').filter({hasText:'校验反馈'});
  await error.locator('input').focus();
  await expect(error.locator('.mori-field__control')).toHaveCSS('border-color',mode==='dark'?'rgb(248, 113, 113)':'rgb(198, 40, 40)');
  await expect(error.locator('input')).toHaveAttribute('aria-invalid','true');
  await expect(page.locator('.mori-textarea__control')).toHaveCSS('background-color','rgb(238, 242, 255)');
  await shot('input-brand-'+mode);
  checks.push(mode+': custom input/textarea, clear, semantic labels, single error border and ARIA');

  await open('switch',mode);
  const sw=page.locator('.mori-switch').filter({hasText:'自定义轨道与滑块'}),track=sw.locator('.mori-switch__track'),thumb=sw.locator('.mori-switch__thumb');
  const bounds=await track.boundingBox();
  await expect(track).toHaveCSS('background-color','rgb(67, 56, 202)');
  await expect(thumb).toHaveCSS('background-color','rgb(255, 255, 255)');
  await sw.getByRole('switch').tap();
  await expect(track).toHaveCSS('background-color','rgb(199, 210, 254)');
  await expect(thumb).toHaveCSS('background-color','rgb(49, 46, 129)');
  expect(await track.boundingBox()).toEqual(bounds);
  const disabled=page.getByRole('switch',{name:'禁用状态',exact:true});
  await disabled.click({force:true});await expect(disabled).toHaveAttribute('aria-checked','true');
  await shot('switch-'+mode);
  await open('checkbox',mode);
  const cb=page.getByRole('checkbox',{name:'自定义选择框',exact:true});
  await expect(cb.locator('.mori-checkbox__box')).toHaveCSS('background-color','rgb(238, 242, 255)');
  await cb.tap();await expect(cb.locator('.mori-checkbox__box')).toHaveCSS('background-color','rgb(67, 56, 202)');
  await expect(cb).toHaveAttribute('aria-checked','true');
  await open('radio',mode);
  const radio=page.getByRole('radio',{name:'自定义单选框',exact:true});
  await expect(radio.locator('.mori-radio__circle')).toHaveCSS('border-color','rgb(129, 140, 248)');
  await radio.tap();await expect(radio.locator('.mori-radio__circle')).toHaveCSS('border-color','rgb(67, 56, 202)');
  await expect(radio.locator('.mori-radio__circle')).toHaveCSS('background-color','rgb(238, 242, 255)');
  checks.push(mode+': switch independent tracks/thumbs and stable size, custom checkbox/radio states');

  await open('tabs',mode);
  const tabs=page.getByRole('tablist',{name:'自定义分类'});
  await expect(tabs).toHaveCSS('background-color','rgb(238, 242, 255)');
  const selected=tabs.getByRole('tab',{selected:true});
  await expect(selected).toHaveCSS('background-color','rgb(199, 210, 254)');
  await expect(selected).toHaveCSS('color','rgb(49, 46, 129)');
  const sizes=await tabs.getByRole('tab').evaluateAll(nodes=>nodes.map(n=>[n.offsetWidth,n.offsetHeight]));
  await selected.focus();await selected.press('ArrowRight');
  await expect(tabs.getByRole('tab',{name:'已完成',exact:true})).toHaveAttribute('aria-selected','true');
  expect(await contrastOn(tabs.getByRole('tab',{name:'已完成',exact:true}),'outlineColor')).toBeGreaterThanOrEqual(3);
  expect(await tabs.getByRole('tab').evaluateAll(nodes=>nodes.map(n=>[n.offsetWidth,n.offsetHeight]))).toEqual(sizes);
  await shot('tabs-'+mode);
  checks.push(mode+': custom tabs, disabled skip and unchanged geometry');

  await open('popup',mode);
  await page.getByRole('button',{name:'自定义弹层',exact:true}).tap();
  const popup=page.getByRole('dialog');
  await expect(popup).toHaveCSS('opacity','1');
  await expect(popup).toHaveCSS('background-color','rgb(238, 242, 255)');
  await expect(popup.locator('.mori-popup__title')).toHaveCSS('color','rgb(49, 46, 129)');
  await expect(page.locator('.mori-popup__overlay')).toHaveCSS('background-color','rgba(15, 23, 42, 0.65)');
  await shot('popup-'+mode);
  await popup.getByRole('button',{name:'关闭弹出层'}).tap();await expect(popup).toHaveCount(0);
  await open('dialog',mode);
  await page.getByRole('button',{name:'自定义确认弹框',exact:true}).tap();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toHaveCSS('opacity','1');
  await expect(dialog.locator('.mori-dialog__message')).toHaveCSS('color','rgb(49, 46, 129)');
  const confirm=dialog.getByRole('button',{name:'确认',exact:true});
  const cancel=dialog.getByRole('button',{name:'取消',exact:true});
  await expect(cancel).toHaveCSS('background-color','rgb(238, 242, 255)');
  await expect(cancel.locator('.mori-button__label')).toHaveCSS('color','rgb(55, 48, 163)');
  expect(await contrastOn(cancel)).toBeGreaterThanOrEqual(4.5);
  await expect(confirm).toHaveCSS('background-color','rgb(67, 56, 202)');
  await shot('dialog-'+mode);
  await confirm.tap();await expect(confirm).toBeDisabled();
  await expect(dialog.getByRole('button',{name:'取消',exact:true})).toBeDisabled();
  await page.keyboard.press('Escape');await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCount(0);
  checks.push(mode+': custom popup/dialog colors, close, async loading and escape lock');
 }
 expect(errors).toEqual([]);
 const report={generated:new Date().toISOString(),browser:browser.version(),checks,errors};
 writeFileSync(new URL('customization-verification.json',out),JSON.stringify(report,null,2));
 console.log('PASS '+checks.length+' customization groups; no page/resource errors.');
} finally { await browser.close(); }
