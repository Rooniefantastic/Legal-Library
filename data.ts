import { Act } from './types';
import { ipc } from './acts/ipc';
import { constitution } from './acts/constitution';
import { bns } from './acts/bns';
import { simpleEdict } from './acts/simple_edict';
import {carriageOfGoodsBySeaAct2025} from './acts/carriage-goods';
import {theCoastingvesselsAct1838} from './acts/coasting-vessels-act';
import {chatgpt} from './acts/ChatGpt';
import{gemini} from './acts/gemini'

/**
 * Act Directory
 * 
 * This file serves as the central registry for all legal acts in the application.
 * Each act is stored in a separate TS file in the 'acts' directory and imported here.
 */

export const acts: Act[] = [
  ipc,
  constitution,
  bns,
  simpleEdict,
  carriageOfGoodsBySeaAct2025,
  theCoastingvesselsAct1838,
  chatgpt,
  gemini
];