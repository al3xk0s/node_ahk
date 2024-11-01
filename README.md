# Node ahk

Это микро - фреймворк, основанный на suchibot, призванный заменить ahk.

## Предварительная установка

```bash
npm i -g suchibot@1.9.2 && \
npm i -g esbuild@0.20.2
```

*Для установки bash - утилиты:*

```bash
cp .node_ahk_source.sh ~/ && \
echo "source ~/.node_ahk_source.sh" >> ~/.bashrc && \
source ~/.bashrc
```

## Комманды

Порой хочется собрать какой - либо отдельный скрипт в bundle и запускать его из случайной папки.

Для этого была сделана утилита `node-ahk`:

+ `node-ahk run ./script.js`            - запуск проекта.
+ `node-ahk build <source> [out]`       - сборка bundle - скрипта (js | ts).
+ `node-ahk deploy`                     - устанавливает node-ahk глобально для пользования в среде node js (в корневой папке проекта).
+ `node-ahk install [-g | <version>]`   - устанавливает версию с гитхаба или версию из глобального npm - хранилища.

**Классические комманды:**

+ `npm i` - установка зависимостей.
+ `npm run build` - сборка bundle библиотеки.
+ `suchibot ./script.js` | `npx suchibot ./script.js` - запуск проекта.
+ `node esbuild.js <source> <out>` - сборка bundle - скрипта.

## API

### Шаблон

Для классического скрипта есть шаблоны на [typescript](./templates/template.ts) и [javascript](./templates/template.js).

### Todo [x]

- [ ] Реализовать улов скролла на linux ref: https://gist.github.com/bfncs/2020943.
- [ ] Реализовать улов скролла на windows ref: https://github.com/xanderfrangos/global-mouse-events.

## Спасибо

- Ядро проекта: [suchibot](https://github.com/suchipi/suchibot).
- Сборка библиотеки в bundle: [tsup](https://github.com/egoist/tsup).
- Идеи для отлова мыши на linux: [bfncs](https://gist.github.com/bfncs/2020943).
- Отлов мыши на windows: [global-mouse-events](https://github.com/xanderfrangos/global-mouse-events).
