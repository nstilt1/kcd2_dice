cd ./dice

# Run cargo tests
cargo test

# Check if the tests were successful
if [ $? -eq 0 ]; then
    echo "No tests failed"
    
    cargo build --release --target wasm32-unknown-unknown

    wasm-bindgen --target web \
      --out-dir ../../frontend/public \
      --no-typescript \
      ../target/wasm32-unknown-unknown/release/dice.wasm

    wasm-opt ../../frontend/public/dice.wasm \
      -o ../../frontend/public/dice_bg.wasm \
      -Oz \
      --enable-bulk-memory --enable-sign-ext --enable-nontrapping-float-to-int

    echo "Build successful"


else
    echo "Tests failed. Run `cargo test` to see which tests failed."
fi