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

+ `node-ahk run ./script.js` - запуск проекта.
+ `node-ahk build <source> [out]` - сборка bundle - скрипта.

**Классические комманды:**

+ `npm i` - установка зависимостей.
+ `npm run build` - сборка bundle библиотеки.
+ `suchibot ./script.js` | `npx suchibot ./script.js` - запуск проекта.
+ `node esbuild.js <source> <out>` - сборка bundle - скрипта.

## API

### Шаблон

Для классического скрипта есть шаблоны на [typescript](./templates/template.ts) и [javascript](./templates/template.js).

// https://github.com/egoist/tsup