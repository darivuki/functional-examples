// leaving old Box for comparison
const Box = x => ({
    map: f => Box(f(x)),
    fold: f => f(x),
    inspect: _ => `Box(${x})`,
})

// wraps a function returning value without executing its call
const LazyBox = g => ({

  // compose with f from outside
  map: f => LazyBox( _ => f(g()) ),

  // compose and evaluate only here!
  fold: f => f(g()),
  foldf: x => g(x)
})

const Fn = g => 
({
  contramap: f => Fn(x => g(f(x))),
  dimap: (f, h) => Fn(x => h(g(f(x)))),
  map: f => Fn(x => f(g(x))),
  concat: ({fold: h}) => Fn(x => g(x).concat(h(x))),
  fold: g
});

const r = Fn(x => x.reverse())
          .dimap(x => x.split(''), x => x.join(''))
          .fold('hello')
console.log(r) // olleh



const nextCharForNumberString = str =>

  // wrap 'str' first into function call
  LazyBox( _ => str )

  // every 'map' composes with new function from outside
  // without calling it
  .map(s => s.trim())
  .map(r => parseInt(r))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))

  // compose again and call the function
  .fold(s => s.toLowerCase())

console.log(
  "nextCharForNumberString(' 64 '): ",
  nextCharForNumberString(' 64 ')
)

