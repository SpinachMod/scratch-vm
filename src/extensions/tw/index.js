const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

// eslint-disable-next-line max-len
 const iconURI = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxODAuNjM4NTkiIGhlaWdodD0iMjYxLjA5MDQ3IiB2aWV3Qm94PSIwLDAsMTgwLjYzODU5LDI2MS4wOTA0NyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0OC4wOTA1OCwtNTIuMzM1NjMpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0zMjAuNzI5MTcsMjM2LjUxNTQ2Yy05Ljg4ODExLDI3LjM5ODk1IC0zNi43NjY2Myw0NC4wNTI2MSAtNzkuODcwMjMsNDkuNTAxNzhjLTEuOTU5MjUsMC4yNDQ5MSAtMy44ODc5LDAuMzk3OTcgLTUuODE2NTQsMC40NTkyYy0yLjUxMDI5LDMuNjczNiAtNS43ODU5Miw2Ljg1NzM5IC05LjY0MzIsOS4zMzcwN2MtMTAuMTAyNDEsNi40NTk0MiAtMTkuNTYxOTMsOS42MTI1OSAtMjguODk5LDkuNjEyNTljLTE5LjE5NDU3LDAgLTM5Ljg1ODU4LC0xNC4zMjcwNSAtMzkuODU4NTgsLTQ1Ljc5NzU3YzAsLTIuMTQyOTMgMC4wOTE4NCwtNC45Mjg3NSAwLjMwNjEzLC04Ljc4NjAzYzAuMDkxODQsLTEuNjUzMTIgMC4xODM2OCwtMi45Mzg4OCAwLjIxNDI5LC0zLjg4NzljLTAuNTIwNDMsLTIuMzg3ODQgLTAuNzk1OTUsLTQuODA2MyAtMC43OTU5NSwtNy4yNTUzNnYtMTQuODE2ODZjMCwtMi40MTg0NSAwLjI0NDkxLC00LjgzNjkxIDAuNzM0NzIsLTcuMjU1MzZjMC4wMzA2MSwtMi4wNTEwOSAwLjEyMjQ1LC00LjM0NzEgMC4yNzU1MiwtNi44NTczOWMtMC43MzQ3MiwtMi42OTM5NyAtMS4yODU3NiwtNS44MTY1NCAtMS4yODU3NiwtOS4zMDY0NmMwLC0xLjU5MTg5IDAuMTIyNDUsLTMuMTgzNzkgMC4zMzY3NSwtNC43NDUwN2MxLjE2MzMxLC04LjIwNDM4IDQuODA2MywtMTYuNDM5MzcgMTAuOTU5NTgsLTIzLjAyMTI0Yy0yLjExMjMyLC01LjkwODM4IC0zLjIxNDQsLTEyLjE1MzUgLTMuMjE0NCwtMTguNTUxNjl2LTE1LjYxMjgxYzAsLTYuMzM2OTYgMS4yNTUxNSwtMTQuMjM1MjEgNy40MDg0MywtMzMuODg4OThjMi41NzE1MiwtOC40NDkyOCAzLjM5ODA4LC0xMS4wODIwMyA0LjUzMDc4LC0xMy41MzExYzYuMDMwODMsLTEzLjUzMTEgMTUuMTIyOTksLTIwLjI5NjY1IDIxLjczNTQ4LC0yMy42MzM1MWMxMC44MDY1MSwtNS4zODc5NSAyMi40MDg5NywtOC4xNDMxNSAzNC40NzA2MywtOC4xNDMxNWM1LjU3MTYzLDAgMTAuODk4MzUsMC41ODE2NSAxNS45ODAxNywxLjY4MzczYzIuMjY1MzksLTEuNTMwNjcgNC42ODM4NCwtMi44MTY0MyA3LjI1NTM2LC0zLjg4NzljMy4yNzU2MywtMS40MDgyMSA2Ljc2NTU1LC0yLjM4Nzg0IDEwLjYyMjgzLC0zLjAwMDExYzkuNjQzMiwtMS42NTMxMiAxOS44Mzc0NSwwLjM5Nzk3IDI4LjcxNTMyLDUuNzg1OTJjOS4zMzcwNyw1LjY5NDA4IDIwLjA1MTc0LDE3LjUxMDg0IDE4LjczNTM3LDQxLjgxNzgzYy0wLjIxNDI5LDQuMjg1ODcgLTAuNTgxNjUsMTAuMDEwNTcgLTEuMTMyNjksMTcuNDgwMjJjLTAuMDMwNjEsMC4xODM2OCAtMC4wMzA2MSwwLjM2NzM2IC0wLjA2MTIzLDAuNTUxMDRjLTAuNDg5ODEsNS40MTg1NiAtMS4xOTM5MiwxMy41MDA0OSAtMi4xNDI5MywyNC4xODQ1NWMwLjI0NDkxLDQuMTMyOCAwLjE1MzA3LDguNzU1NDIgLTAuMjE0MjksMTQuMjA0NTljLTAuMTUzMDcsMi4wODE3MSAtMC40ODk4MSw0LjE2MzQyIC0xLjA0MDg1LDYuMTgzOWMtMC4xMjI0NSwwLjQ1OTIgLTAuMjQ0OTEsMC44ODc3OSAtMC4zNjczNiwxLjI4NTc2YzQuMTMyOCw1LjI5NjExIDYuOTQ5MjMsMTAuNTkyMjIgOC44Nzc4NywxNS4xODQyMmMxLjgwNjE5LDMuNjQyOTkgMy4zMzY4Niw3LjgzNzAyIDQuNjgzODQsMTIuOTQ5NDVjMC41MjA0MywxLjkyODY0IDAuODU3MTcsMy44ODc5IDEuMDEwMjQsNS44Nzc3NmMxLjM3NzYsMTcuMTc0MDkgMC42NzM0OSwyNy4zMDcxMSAtMi41MTAyOSwzNS44Nzg4NHoiIGZpbGw9IiM0YTg4MDAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxNiIvPjxwYXRoIGQ9Ik0yODkuNjc0OTksMjAzLjM0MjgzYzAuODk2OTcsMTEuMTM0MDcgMC43MTMyOSwxOC4zMDk4NCAtMC41Mzg3OSwyMS41NDI2MWMtNS4yMTAzOSwxNC43MjE5NiAtMjIuNzE1MSwyMy45NjQxMyAtNTIuNTA4MDIsMjcuNzM1NjljLTEwLjA1NjQ5LDEuMjU4MjEgLTIwLjEwNjg1LC0zLjQ5OTExIC0zMC4xNjMzMywtMTQuMjcxOTRjMCwxLjYxNjM4IDAuMzU4MTgsNi40NjI0OCAxLjA4MDY1LDE0LjU0NDRjMC41Mzg3OSw1LjkyMzY4IDAuNDQ2OTUsMTAuNzY5NzggLTAuMjY5NCwxNC41MzgyOGMtNC40OTA5OCwyLjg3MTUzIC04LjA3ODg2LDQuMzEwMzYgLTEwLjc3Mjg0LDQuMzEwMzZjLTQuMTMyOCwwIC02LjE5MzA4LC00LjAzNzkgLTYuMTkzMDgsLTEyLjExOTgyYzAsLTEuNDM1NzcgMC4wODg3OCwtMy43MjI1OCAwLjI2OTQsLTYuODYzNTFjMC4xNzc1NiwtMy4xMzc4NyAwLjI2OTQsLTUuMzM4OTcgMC4yNjk0LC02LjU5NzE4YzAsLTMuMDUyMTUgLTAuMjY5NCwtNS4yMDQyNyAtMC44MDgxOSwtNi40NjI0OHYtMTQuODEwNzRjMCwtMC4zNTgxOCAwLjA4ODc4LC0wLjc2MjI3IDAuMjY5NCwtMS4yMTIyOWMwLjE3NzU2LC0wLjQ0Njk1IDAuMzU4MTgsLTAuODUxMDUgMC41Mzg3OSwtMS4yMTIyOWMtMC4xODA2MiwtMi41MTAyOSAtMC4wOTE4NCwtNi4zNzA2NCAwLjI2OTQsLTExLjU3Nzk3YzAuMzU4MTgsLTMuMjMyNzcgMC4zNTgxOCwtNS4yOTMwNSAwLC02LjE5MzA4Yy0wLjkwMDAzLC0xLjc5MDg4IC0xLjM0MzkzLC0yLjg2ODQ3IC0xLjM0MzkzLC0zLjIyOTcxYzAuNzEzMjksLTUuMDI2NzEgNC4zOTkxNCwtNy41NDAwNyAxMS4wMzkxNywtNy41NDAwN2M0LjMwNzMsMCA2LjkwOTQzLDEuNTI3NjEgNy44MDk0Nyw0LjU3NjdjMCwyLjg3MTUzIDAuMzU4MTgsNy4wOTMxMSAxLjA3NzU5LDEyLjY1NTU2YzEuMDgwNjUsNi40NjI0OCA0LjQ4NzkyLDEyLjkyODAyIDEwLjIzNDA0LDE5LjM4NzQzYzYuMjgxODYsNy4zNjI1MSAxMi4yOTQzMiwxMC43NzI4NCAxOC4wNDM1MSwxMC4yMzQwNGM2LjQ2MjQ4LC0wLjcxMzI5IDEyLjkyNDk2LC0yLjI0MDkgMTkuMzg3NDMsLTQuNTc2N2M4Ljk3NTgzLC0zLjIzMjc3IDE0LjM2MDcyLC03LjAwMTI3IDE2LjE1NzczLC0xMS4zMDg1N2MxLjI1MjA5LC0zLjIzMjc3IDEuODgyNzIsLTYuNjQwMDQgMS44ODI3MiwtMTAuMjM0MDRjMCwtMTAuOTQ3MzMgLTQuMDM3OSwtMTkuMTE4MDQgLTEyLjExNjc2LC0yNC41MDI5MmMtMy41OTQwMSwtMi4zMzI3NCAtMTAuMjM0MDQsLTQuMjE4NTIgLTE5LjkyOTI5LC01LjY1NzM1Yy01LjU2NTUxLC0wLjcxMzI5IC04Ljk3ODksLTEuMDc3NTkgLTEwLjIzMDk4LC0xLjA3NzU5Yy04LjYxNzY2LDAuMTgwNjIgLTE2LjY1MzY2LC0yLjYwMjEzIC0yNC4xMDE4OSwtOC4zNDgyNmMtNy40NTEyOSwtNS43NDMwNiAtMTEuMTczODcsLTEyLjM4OTIyIC0xMS4xNzM4NywtMTkuOTI5Mjl2LTE1LjYxNTg3YzAsLTMuNDA3MjcgMS45NzQ1NiwtMTEuMzk3MzUgNS45MjY3NCwtMjMuOTY0MTNjMS43OTA4OCwtNS45MjY3NCAyLjc3OTY5LC05LjA2NDYxIDIuOTYzMzcsLTkuNDI1ODVjMS42MTMzMiwtMy43Njg1IDMuNjc2NjYsLTYuMjgxODYgNi4xOTAwMiwtNy41NDAwN2M2LjEwMTI0LC0zLjA0OTA5IDEyLjU2MzcyLC00LjU3NjcgMTkuMzg3NDMsLTQuNTc2N2MxMy4yODMxMywwIDIzLjA2NzE2LDUuMzg0ODkgMjkuMzUyMDgsMTYuMTU0NjZjMC41Mzg3OSwwLjUzODc5IDEuNDM1NzcsMS4zNDY5OSAyLjY5Mzk3LDIuNDI0NThjMC4xNzc1NiwtMi41MTAyOSAwLjUzODc5LC02LjM3MDY0IDEuMDc3NTksLTExLjU3Nzk3Yy0wLjE4MDYyLC0yLjMzMjc0IC0wLjM2MTI0LC00LjU3NjcgLTAuNTM4NzksLTYuNzMxODhjMCwtMi41MTAyOSAxLjI1MjA5LC00LjIxNTQ2IDMuNzY4NSwtNS4xMTU0OWMwLjcxNjM1LC0wLjM1ODE4IDEuNzA1MTYsLTAuNjI3NTcgMi45NjMzNywtMC44MDgxOWMxLjc5Mzk0LC0wLjM1ODE4IDMuNzI1NjQsMC4wOTE4NCA1Ljc5MjA1LDEuMzQzOTNjMi4wNjAyOCwxLjI1ODIxIDIuOTE0MzksNS4wMjk3NyAyLjU1NjIxLDExLjMwODU3Yy0wLjE4MDYyLDMuOTQ5MTIgLTAuNTM4NzksOS41MTQ2MyAtMS4wNzc1OSwxNi42OTM0NmMtMC41Mzg3OSw1LjkyNjc0IC0xLjM0MzkzLDE0Ljk5MTM2IC0yLjQyNDU4LDI3LjE5OTk2YzAuMzU4MTgsMi44NzE1MyAwLjM1ODE4LDYuODIzNzIgMCwxMS44NDczN2MtMC45MDAwMywzLjQxMDMzIC0zLjU5NDAxLDUuMTE1NDkgLTguMDc4ODYsNS4xMTU0OWMtMi4zMzU4LDAgLTQuNTc2NywtMC42Mjc1NyAtNi43MzE4OCwtMS44ODI3MmMtMS4wNzc1OSwtMy40MDcyNyAtMS42MTMzMiwtNC44NDkxNSAtMS42MTMzMiwtNC4zMTAzNmMwLjM1NTExLC00Ljg0NjA5IC0wLjYzMDYzLC0xMS4zMDg1NyAtMi45NjMzNywtMTkuMzg3NDNjLTEuOTc3NjIsLTQuMTI2NjggLTQuNzExMzksLTEwLjAwNDQ0IC04LjIxMzU2LC0xNy42MzYzNWMtMy41MDIxNywtNy42Mjg4NSAtOC4xMjQ3OCwtMTEuNzE1NzMgLTEzLjg2Nzg1LC0xMi4yNTQ1MmMtNy4xODE4OSwtMC41Mzg3OSAtMTEuODQ3MzcsMS44ODU3OCAtMTQuMDAyNTUsNy4yNzA2N2MtMC43MTYzNSwyLjMzNTggLTEuNzA4MjIsNS43NDkxOSAtMi45NjAzMSwxMC4yMzQwNGMtMi4xNTUxOCw2LjY0MzEgLTMuNTAyMTcsMTMuMDE2OCAtNC4wNDA5NiwxOS4xMTgwNGMtMC4xODA2MiwxLjk3NzYyIC0wLjM2MTI0LDIuNzg1ODEgLTAuNTM4NzksMi40MjQ1OGMwLjUzODc5LDMuNTk0MDEgMS4xNjYzNyw3LjE4MTg5IDEuODg1NzgsMTAuNzcyODRjMC44OTY5Nyw0LjQ4NzkyIDMuMDk4MDcsNy45MDEzMSA2LjU5NzE4LDEwLjIzMDk4YzMuNTAyMTcsMi4zMzU4IDEwLjE4NTA2LDMuNzY4NSAyMC4wNjA5Myw0LjMwNzNjMjQuMjMzNTMsMS40NDE4OSAzOS4yMjE4Miw5Ljg3ODkzIDQ0Ljk2Nzk1LDI1LjMxNDE4YzAuODkzOTEsMS40Mzg4MyAxLjc5MDg4LDMuODYwMzQgMi42OTA5MSw3LjI2NzYxeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAiLz48L2c+PC9nPjwvc3ZnPg==`;

/**
 * Class for NitroBolt blocks
 * @constructor
 */
class SpinachModBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'tw',
            name: 'SpinachMod',
            color1: '#00B208',
            color2: '#009600',
            color3: '#006900',
            docsURI: 'https://docs.turbowarp.org/blocks',
             menuIconURI: iconURI,
             blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'getLastKeyPressed',
                    text: formatMessage({
                        id: 'tw.blocks.lastKeyPressed',
                        default: 'last key pressed',
                        description: 'Block that returns the last key that was pressed'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getButtonIsDown',
                    text: formatMessage({
                        id: 'tw.blocks.buttonIsDown',
                        default: '[MOUSE_BUTTON] mouse button down?',
                        description: 'Block that returns whether a specific mouse button is down'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        MOUSE_BUTTON: {
                            type: ArgumentType.NUMBER,
                            menu: 'mouseButton',
                            defaultValue: '0'
                        }
                    }
                }
            ],
            menus: {
                mouseButton: {
                    items: [
                        {
                            text: formatMessage({
                                id: 'tw.blocks.mouseButton.primary',
                                default: '(0) primary',
                                description: 'Dropdown item to select primary (usually left) mouse button'
                            }),
                            value: '0'
                        },
                        {
                            text: formatMessage({
                                id: 'tw.blocks.mouseButton.middle',
                                default: '(1) middle',
                                description: 'Dropdown item to select middle mouse button'
                            }),
                            value: '1'
                        },
                        {
                            text: formatMessage({
                                id: 'tw.blocks.mouseButton.secondary',
                                default: '(2) secondary',
                                description: 'Dropdown item to select secondary (usually right) mouse button'
                            }),
                            value: '2'
                        }
                    ],
                    acceptReporters: true
                }
            }
        };
    }

    getLastKeyPressed (args, util) {
        return util.ioQuery('keyboard', 'getLastKeyPressed');
    }

    getButtonIsDown (args, util) {
        const button = Cast.toNumber(args.MOUSE_BUTTON);
        return util.ioQuery('mouse', 'getButtonIsDown', [button]);
    }
}

module.exports = SpinachModBlocks;
