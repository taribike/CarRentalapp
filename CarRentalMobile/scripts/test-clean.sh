#!/bin/bash
# Filter out Console Ninja warnings from test output

jest "$@" 2>&1 | sed '/Console Ninja/,+5d' | sed '/tinyurl\.com/d' | sed '/Estimated release dates/,+2d' | grep -v "We are working hard"

